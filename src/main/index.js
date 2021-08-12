'use strict'

import { app, BrowserWindow, session, ipcMain } from 'electron'
import os from 'os'
import path from 'path'

import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
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
  mainWindow.loadURL(winURL)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyUp' && input.key.toLowerCase() === 'escape') {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false)
      }
      event.preventDefault()
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    // Add chrom vue-devtools extension
    session.defaultSession.loadExtension('F:/repositories/workspaces/image_processor/node_modules/vue-devtools/vender', { allowFileAccess: true })
  }
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
ipcMain.on('toggleFullScreen', (event, args) => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen())
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
