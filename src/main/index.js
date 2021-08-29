'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

import '../renderer/store'

// npm run dev
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9990`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#454545',
    height: 563,
    width: 1000,
    useContentSize: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    autoHideMenuBar: true
  })

  mainWindow.removeMenu()
  mainWindow.loadURL(winURL)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyUp' && input.key.toLowerCase() === 'escape') {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false)
      }
      event.preventDefault()
    }
  })
  mainWindow.webContents.session.protocol.registerFileProtocol('file', (request, callback) => {
    const url = request.url.substr(8)
    callback(decodeURI(url))
  })
  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.destroy()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    // session.defaultSession.loadExtension('C:/Users/cross/AppData/Roaming/Electron/extensions/nhdogjmejiglipccpnnnanhbledajbpd', { allowFileAccess: true })
    // session.defaultSession.loadExtension(
    //  'C:/Users/cross/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.4_0', { allowFileAccess: true })

    // mainWindow.webContents.on('did-frame-finish-load', () => {
    //   mainWindow.webContents.once('devtools-opened', () => {
    //     mainWindow.focus()
    //     // Add chrom vue-devtools extension
    //   })
    //   // open electron debug
    //   console.log('Opening dev tools')
    //   mainWindow.webContents.openDevTools()
    // })
  }
}
app.allowRendererProcessReuse = false
app.on('ready', createWindow)

// const devToolsPath = 'C:/Users/cross/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.4_0'
// app.whenReady().then(async () => {
//   await session.defaultSession.loadExtension(devToolsPath)
// })

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

ipcMain.on('toggleFullScreen', (event, args) => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen())
})

// const Caman = require('caman').Caman
// Caman('F:/repositories/workspaces/image_processor/static/images/5.jpg', function () {
//   this.brightness(40)
//   this.render(function () {
//     this.save('./output.png')
//   })
// })

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
