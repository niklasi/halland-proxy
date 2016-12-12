import electron, { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { resolve } from 'path'
import { START_PROXY, GET_HTTP_MESSAGE_DETAILS, SEND_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'
import debugFactory from 'debug'
import appMenu from './menu'

const debug = debugFactory('halland-proxy:main')

let win = null
let proxy = null

app.on('window-all-closed', () => {
  debug('All window closed...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (err) => {
  debug('Crashed...', err)
})

app.on('ready', () => {
  debug('App ready...')
  electron.Menu.setApplicationMenu(appMenu)
  win = new BrowserWindow({width: 968, height: 800, titleBarStyle: 'hidden-inset'})
  win.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))

  win.on('unresponsive', () => {
    debug('BrowserWindow is unresponsive...')
  })

  proxy = new BrowserWindow({width: 400, height: 400, show: false})
  proxy.loadURL('file://' + resolve(__dirname, 'proxy.html'))

  proxy.on('ready-to-show', () => {
    debug('Send start command to proxy...')
    proxy.webContents.send(START_PROXY, win.id)
  })

  globalShortcut.register('f12', () => {
    debug('Toggle dev tools on main window...')
    win.toggleDevTools()
  })

  globalShortcut.register('f11', () => {
    debug('Toggle dev tools on proxy window...')
    proxy.show()
    proxy.toggleDevTools()
  })

  ipcMain.on(GET_HTTP_MESSAGE_DETAILS, (e, requestId) => {
    debug('Tell proxy to send http message details...')
    proxy.webContents.send(SEND_HTTP_MESSAGE_DETAILS, requestId)
  })

  win.on('closed', () => {
    win = null
    proxy.close()
    debug('Gui window closed...')
  })

  win.webContents.on('crashed', (evt, killed) => {
    debug('Gui window crashed...')
  })

  proxy.webContents.on('crashed', (evt, killed) => {
    debug('Proxy window crashed...')
  })

  proxy.on('closed', () => {
    proxy = null
    debug('Proxy window closed...')
  })
})
