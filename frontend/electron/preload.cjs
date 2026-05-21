const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update:available', (_event, version) => callback(version))
  },
  onDownloadProgress: (callback) => {
    ipcRenderer.on('update:progress', (_event, percent) => callback(percent))
  },
})
