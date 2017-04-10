import electron, { app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import debugFactory from 'debug'
import appMenu from './menu'
import { START_PROXY } from './constants/ipcMessages'

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

  proxy = new BrowserWindow({width: 300, height: 300, show: false})
  proxy.loadURL('file://' + resolve(__dirname, 'proxy.html'))

  win.on('unresponsive', () => {
    debug('BrowserWindow is unresponsive...')
  })

  proxy.on('unresponsive', () => {
    debug('Proxy is unresponsive...')
  })

  proxy.on('ready-to-show', () => {
    debug('Send start command to proxy...', START_PROXY)
    proxy.webContents.send(START_PROXY, win.id)
  })

  win.on('closed', () => {
    win = null
    debug('Gui window closed...')
    if (proxy) proxy.close()
  })

  proxy.on('closed', () => {
    proxy = null
    debug('Proxy window closed...')
  })

  win.webContents.on('crashed', (evt, killed) => {
    debug('Gui window crashed...')
  })

  proxy.webContents.on('crashed', (evt, killed) => {
    debug('Proxy window crashed...')
  })
})
