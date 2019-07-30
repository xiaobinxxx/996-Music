'use strict'

import { app, BrowserWindow,Menu, Tray } from 'electron'
const path = require('path');
import { ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
  })
  // 打开窗口的调试工具
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
  // 监听窗口拖动
  // mainWindow.on('move', (event) =>{
  //   let winWindth = mainWindow.getPosition();
  //   // console.log(event)
  //   console.log(winWindth[0])
  //   if(winWindth[0] >= 1600){
  //     mainWindow.setSize(16, 80);
  //     mainWindow.setPosition(1900, winWindth[1])
  //   }
  // })
  // 自定义窗口
  ipcMain.on('remote-control', (ev,WinParams) => {
    mainWindow.setSize(WinParams.width, WinParams.height);
    mainWindow.setMaximizable(WinParams.Maximizable);
    mainWindow.setResizable(WinParams.Resizable);
    mainWindow.setAlwaysOnTop(WinParams.AlwaysOnTop);
    mainWindow.center();
  });
  // 自定义窗口事件
  ipcMain.on('min', e=> mainWindow.minimize());
  ipcMain.on('max', e=> {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  });
  // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
  // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
  ipcMain.on('close', event=> {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      event.preventDefault();
  });
  // mainWindow.on('close', (event) => {
  //   mainWindow.hide();
  //   mainWindow.setSkipTaskbar(true);
  //   event.preventDefault();
  // });
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })
  //创建系统通知区菜单
  tray = new Tray(path.resolve('./resources/static/icon.ico'));
  // tray = new Tray(__dirname+'/icon.ico');
  const contextMenu = Menu.buildFromTemplate([
    {label: '退出', click: () => {mainWindow.destroy()}},//我们需要在这里有一个真正的退出（这里直接强制退出）
  ])
  tray.setToolTip('My本地播放器')
  tray.setContextMenu(contextMenu)
  tray.on('click', ()=>{ //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.isVisible() ?mainWindow.setSkipTaskbar(false):mainWindow.setSkipTaskbar(true);
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
