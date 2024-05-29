/*
 * This file serves as a collection point for external JS and CSS dependencies.
 * It amalgamates these external resources for easier injection into the application.
 * Additionally, you can directly include any script files in this file
 * that you wish to attach to the application.
 */

const contentWidthKey = 'cWidthz';

function applyCss() {
  const css = `
    * {
      font-family: "FZYouSongJ GBK 506L", "FZSong III-Z05S", TsangerJinKai05, sans-serif !important;
    }
    
    .readerControls {
      left: unset !important;
      margin-left: unset !important;
      right: 16px !important;
      transition: opacity .3s ease-in-out;
    }

    div.app_content div.readerTopBar {
      height: 32px;
      left:0;
      right:0;
      width: unset;
      max-width: unset;
      transition: opacity .3s ease-in-out;
    }

    div.readerContent div.app_content {
      max-width: ${getLS(contentWidthKey) || 1000}px !important; 
    }

    .wr_whiteTheme .readerContent div.app_content {
      background-color: rgb(253,246,227) !important;
    }

    .readerBottomBar {
      display: none !important;
    }
    
    .drag-bar {
      position: fixed;
      height: 100%;
      width: 8px;
      top: 0;
      bottom: 0;
    }

    .right-bar {
      cursor: col-resize;
      left: 50%;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
      background: linear-gradient(0.25turn, #295BE9, #295BE9 20%, transparent 20%, transparent);
      opacity: 0;
    }

    .right-bar.active {
      opacity: 1;
    }

    .left-bar {
      right: 50%;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
      background: linear-gradient(0.75turn, #295BE9, #295BE9 20%, transparent 20%, transparent);
      opacity: 0;
    }

    .left-bar.active {
      opacity: 1;
    }

    .darg-indicator {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: linear-gradient(0.25turn, transparent, #295BE9 20%, #295BE9 80%, transparent);
      height: 2px;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
      opacity: 0;
      display: none;
    }

    .darg-indicator.active {
      opacity: 1;
      display: block;
    }

    .ind-num {
      font-size: 30px;
      color: #295BE9;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 50%;
      width: 500px;
      text-align: center;
      margin: auto auto 0;
      text-shadow: 5px 3px 6px #576b95;
      background: linear-gradient(45deg, transparent,#fff 50%, #fff 50%, transparent);
      margin-bottom: 2px;
      z-index: 10;
      opacity: 0;
      display: none;
    }

    .ind-num.active {
      opacity: 1;
      display: block;
    }

    button.menu_option_list_link {
      width: 100%
    }

    .readerControls {
      align-items: flex-end !important;
    }

    div.readerCatalog {
      left: unset;
      right: 0;
    }

    div.readerNotePanel {
      left: unset;
      right: 0; 
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.innerHTML = css;
  document.head.appendChild(styleElement);
};

function saveLS(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
  }
}

function getLS(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

let removeTimer = null;
function scrollChange(isDown, diff) {
  const readerTopBar = document.querySelector('.readerTopBar');
  const readerControls = document.querySelector('.readerControls');
  if (removeTimer) {
    clearTimeout(removeTimer);
  }

  if (isDown) {
    readerTopBar.style.opacity = 0;
    readerControls.style.opacity = 0;

    removeTimer = setTimeout(() => {
      readerTopBar.style.display = 'none';
      readerControls.style.display = 'none';
    }, 300);
  } else {
    readerTopBar.style.display = 'flex';
    readerControls.style.display = 'flex';
    readerTopBar.style.opacity = 1;
    readerControls.style.opacity = 1;
  }

  renderMenu(false)
}

let lastScrollY;
function scrollListener() {
  window.addEventListener('scroll', () => {
    const curY = window.scrollY;

    if (typeof lastScrollY !== 'number') {
      lastScrollY = curY;
      return;
    }

    scrollChange(curY > lastScrollY, curY - lastScrollY);

    lastScrollY = curY;
  });
}

function loadDynamicCss(url) {
  const fileref = document.createElement("link");
  fileref.rel = "stylesheet";
  fileref.type = "text/css";
  fileref.href = url;
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

function loadFont() {
  loadDynamicCss('https://npm.elemecdn.com/lxgw-wenkai-screen-webfont@1.7.0/style.css');
}

function changeContentSize(sizePx) {
  const content = document.querySelector(".readerContent div.app_content");
  content.style.setProperty('max-width',`${sizePx}px`, 'important');
  const event = new Event('resize');
  window.dispatchEvent(event);
}

function renderDragBar() {

  let contentWidth = +getLS(contentWidthKey) || 1000;

  const rightBar = document.createElement('div');
  rightBar.className = 'drag-bar right-bar ';
  rightBar.style.marginLeft = `${contentWidth / 2}px`;
  document.body.appendChild(rightBar);

  const leftBar = document.createElement('div');
  leftBar.className = 'drag-bar left-bar ';
  leftBar.style.marginRight = `${contentWidth / 2}px`;
  document.body.appendChild(leftBar);

  const dragIndicator = document.createElement('div');
  dragIndicator.className = 'darg-indicator';
  dragIndicator.style.width = `${contentWidth}px`;
  document.body.appendChild(dragIndicator);

  const indicatorNum = document.createElement('div');
  indicatorNum.className = 'ind-num';
  document.body.appendChild(indicatorNum);


  function makeEleActive(e) {
    if (e.className && e.className.indexOf('active') >= 0) {
      return;
    }

    e.className += ' active';
  }

  function makeEleInactive(e) {
    e.className = e.className.replace(' active', '');
  }

  function changeIndNum(newNum) {
    indicatorNum.innerText = newNum;
  }

  let isDrag = false;
  let dragClientX = -1;
  let marginWidth;
  rightBar.addEventListener('mouseover', (e) => {
    makeEleActive(rightBar);
  });

  rightBar.addEventListener('mouseleave', () => {
    if (!isDrag) {
      makeEleInactive(rightBar);
    }
  });

  rightBar.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }
    isDrag = true;
    makeEleActive(leftBar);
    makeEleActive(dragIndicator);
    makeEleActive(indicatorNum);

    dragClientX = e.clientX;
    marginWidth = contentWidth / 2;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDrag) {
      let clientX = e.clientX;
      if (clientX >= window.innerWidth) {
        clientX = window.innerWidth;
      }

      if (clientX <= (window.innerWidth/2 + 202)) {
        clientX = window.innerWidth/2 + 202;
      }
      const offset = clientX - dragClientX;
      dragClientX = clientX;
      marginWidth = offset + marginWidth;
      rightBar.style.marginLeft = `${marginWidth}px`;
      leftBar.style.marginRight = `${marginWidth}px`;
      dragIndicator.style.width = `${marginWidth * 2}px`;
      changeIndNum(marginWidth * 2);
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isDrag) {
      isDrag = false;
      console.log('moseup');
      makeEleInactive(rightBar);
      makeEleInactive(leftBar);
      makeEleInactive(dragIndicator);
      makeEleInactive(indicatorNum);
      contentWidth = marginWidth * 2;
      changeContentSize(contentWidth);
      saveLS(contentWidthKey, contentWidth);
    }
  });

}

function setTitle(title) {
  window.__TAURI__.window.getCurrent().setTitle(title);
}

function titleHelper() {
  setTitle(document.title);
  new MutationObserver(function (mutations) {
    setTitle(mutations[0].target.nodeValue);
  }).observe(
    document.querySelector('title'),
    { subtree: true, characterData: true, childList: true }
  );
}

function modifyHeader() {
  const sendBook = document.querySelector('.navBar_link.navBar_link_Upload');
  const linkPage = document.querySelector('.navBar_link.navBar_link_ink');
  const linkPhone = document.querySelector('.navBar_link.navBar_link_Phone');

  function createALink(name, url) {
    const item = document.createElement('a');
    item.innerText = name;
    item.target = '_blank';
    item.className = 'navBar_link';
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      window.__TAURI__.shell.open(url);
    });
    return item;
  }


  if (sendBook) {
    const githubLink = createALink('Github', 'https://github.com/zeyios/weread-pc');
    sendBook.replaceWith(githubLink);
  }

  if (linkPage) {
    const reportLink = createALink('PC版问题反馈', 'https://github.com/zeyios/weread-pc/issues');
    linkPage.replaceWith(reportLink);
  }
}

function customHeader() {
  modifyHeader();

  var observer = new MutationObserver(function(mutations, observer) {
      modifyHeader();
  });
  var options = {
    'childList': true,
    'subtree': true,
  };
  observer.observe(document.body, options);
  
}

function fullScreenTrigger() {
  const tauri = window.__TAURI__;
  const appWindow = tauri.window.appWindow;
  appWindow.isFullscreen().then((fullscreen) => {
    appWindow.setFullscreen(!fullscreen).then();
  });
}

function fullScreenButton() {
  const button = document.createElement('button');
  button.textContent = '全屏切换(F11)'
  button.className = 'menu_option_list_link'

  button.addEventListener('click', () => {
    fullScreenTrigger()
  })
  return button
}

function fontChangeButton() {
  const button = document.createElement('button');
  button.textContent = '🚧字体设置'
  button.className = 'menu_option_list_link'

  button.addEventListener('click', () => {
    window.pakeToast('🚧施工中，敬请期待')
    console.log('click fontChange button')
  })
  return button
}

function backgroundChangeButton() {
  const button = document.createElement('button');
  button.textContent = '🚧背景设置'
  button.className = 'menu_option_list_link'

  button.addEventListener('click', () => {
    window.pakeToast('🚧施工中，敬请期待')
    console.log('click bg change button')
  })
  return button
}


function renderMenu(isShow) {

  const existedDom = document.getElementById('header-menu-id')
  
  if (!isShow) {
    if (!!existedDom) {
      existedDom.style.visibility = 'hidden'
    }
    return
  }

  if (!!existedDom) {
    // 已经存在了，不需要再创建了。
    existedDom.style.visibility = 'visible'
    return;
  }

  const menuDom = document.createElement('div');
  menuDom.id = 'header-menu-id';
  document.body.appendChild(menuDom);

  menuDom.className = 'menu_option_containerBorder'

  menuDom.style = `
    position: fixed;
    top: 40px;
    right: 16px;
    background: white;
    border: 1px solid #f2f2f2
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
    z-index: 1000;
  `;

  menuDom.appendChild(fullScreenButton())
  menuDom.appendChild(fontChangeButton())
  menuDom.appendChild(backgroundChangeButton())

}

// 头像下的menu
function customMenu() {
  const clickAreaDom = document.createElement('div');
  clickAreaDom.id = 'header-menu-click-area';
  document.body.appendChild(clickAreaDom);

  clickAreaDom.style = `
    width: 80px; 
    height: 32px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    cursor: pointer;
  `;


  clickAreaDom.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopImmediatePropagation()
    renderMenu(true)
  })
}

document.addEventListener('keydown', function(event) {
  // 检查是否按下的是F11键
  if (event.key === 'F11') {
      fullScreenTrigger()
  }
});

document.addEventListener('click', () => {
  console.log('click docmutmen')
  renderMenu(false)
})

document.addEventListener('DOMContentLoaded', () => {
  titleHelper();
  loadFont();

  applyCss();
  customHeader();

  if (window.location.pathname.indexOf('web/reader') >= 0) {
    // 阅读页面
    scrollListener();
    renderDragBar();
    customMenu()
  }
});


