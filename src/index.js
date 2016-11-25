import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { resolve } from 'path'
import { START_PROXY, GET_HTTP_MESSAGE_DETAILS, SEND_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'

let win = null
let proxy = null

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (err) => {
  console.log('Crashed...', err)
})

app.on('ready', () => {
  win = new BrowserWindow({width: 968, height: 800, titleBarStyle: 'hidden-inset'})
  win.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))

  win.on('unresponsive', () => {
    console.log('BrowserWindow is unresponsive...')
  })

  proxy = new BrowserWindow({width: 400, height: 400, show: false})
  proxy.loadURL('file://' + resolve(__dirname, 'proxy.html'))

  proxy.on('ready-to-show', () => {
    proxy.webContents.send(START_PROXY, win.id)
  })

  globalShortcut.register('f12', () => {
    win.toggleDevTools()
  })

  globalShortcut.register('f11', () => {
    proxy.toggleDevTools()
  })

  ipcMain.on(GET_HTTP_MESSAGE_DETAILS, (e, requestId) => {
    proxy.webContents.send(SEND_HTTP_MESSAGE_DETAILS, requestId)
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