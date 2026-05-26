const { app, BrowserWindow, ipcMain, shell, Notification, Tray, Menu, nativeImage } = require('electron')
const path = require('node:path')
const { autoUpdater } = require('electron-updater')

const isDev = process.env.NODE_ENV === 'development'
const PROD_URL = process.env.ELECTRON_APP_URL || 'https://app.flowmeet.kr'

autoUpdater.autoDownload = false

let win = null
let tray = null
// 트레이 메뉴에서 '종료'를 선택한 경우에만 실제로 종료
let isQuiting = false

function showWindow() {
  if (!win) return
  win.show()
  win.focus()
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon.png')
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip('FlowMeet')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'FlowMeet 열기', click: showWindow },
    { type: 'separator' },
    {
      label: '종료',
      click: () => {
        isQuiting = true
        app.quit()
      },
    },
  ])
  tray.setContextMenu(contextMenu)

  // Windows/Linux: 트레이 아이콘 클릭으로 창 열기
  tray.on('click', showWindow)
}

function createWindow() {
  win = new BrowserWindow({
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

  // X 버튼: 종료가 아닌 트레이로 숨기기
  win.on('close', (event) => {
    if (!isQuiting) {
      event.preventDefault()
      win.hide()
    }
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
  ipcMain.handle('notification:show', (_event, { title, body }) => {
    if (!Notification.isSupported()) return
    const notif = new Notification({ title, body })
    notif.on('click', showWindow)
    notif.show()
  })

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })

  createTray()
  createWindow()
})

// 모든 창이 닫혀도 앱을 종료하지 않음 (트레이 상주)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // macOS는 창이 없어도 앱이 살아있는 게 기본 동작
    // Windows/Linux는 명시적으로 막아야 함
  }
})

// macOS: 독 아이콘 클릭 시 창 다시 열기
app.on('activate', () => {
  showWindow()
})
