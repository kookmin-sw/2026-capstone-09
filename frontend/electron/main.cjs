const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('node:path')
const { autoUpdater } = require('electron-updater')

const isDev = process.env.NODE_ENV === 'development'
const PROD_URL = process.env.ELECTRON_APP_URL || 'https://app.flowmeet.kr'

autoUpdater.autoDownload = false

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadURL(isDev ? 'http://localhost:3000' : PROD_URL)

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (!isDev) {
    autoUpdater.checkForUpdates()
  }

  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update:available', info.version)
  })

  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('update:progress', Math.floor(progress.percent))
  })
}

app.whenReady().then(() => {
  ipcMain.handle('app:getVersion', () => app.getVersion())
  ipcMain.handle('update:download', () => autoUpdater.downloadUpdate())

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })

  createWindow()
})
