import electron, { app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import debugFactory from 'debug'
import appMenu from './menu'
import loadProxy from './load-proxy'

const debug = debugFactory('halland-proxy:main')

let win = null

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

  loadProxy(win)

  win.on('closed', () => {
    win = null
    debug('Gui window closed...')
  })

  win.webContents.on('crashed', (evt, killed) => {
    debug('Gui window crashed...')
  })
})
