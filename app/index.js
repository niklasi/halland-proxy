import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { resolve } from 'path'

let win = null
let proxy = null

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  win = new BrowserWindow({width: 640, height: 800, titleBarStyle: 'hidden-inset'})
  win.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))

  proxy = new BrowserWindow({width: 400, height: 400, show: false})
  proxy.loadURL('file://' + resolve(__dirname, 'proxy.html'))

  proxy.on('ready-to-show', () => {
    proxy.webContents.send('start-proxy', win.id)
  })

  globalShortcut.register('f12', () => {
    win.toggleDevTools()
  })

  globalShortcut.register('f11', () => {
    proxy.toggleDevTools()
  })

  ipcMain.on('get-request-details', (e, requestId) => {
    proxy.webContents.send('send-request-details', requestId)
  })

  win.on('closed', () => {
    win = null
    console.log('Gui window closed...')
  })

  win.webContents.on('crashed', (evt, killed) => {
    console.log('Gui window crashed...')
  })

  proxy.webContents.on('crashed', (evt, killed) => {
    console.log('Proxy window crashed...')
  })

  proxy.on('closed', () => {
    proxy = null
  })
})
