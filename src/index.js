import electron, { app } from 'electron'
import debugFactory from 'debug'
import appMenu from './menu'
import { START_PROXY } from './constants/ipcMessages'
import { createMainWindow, createProxyWindow, sendToProxyWindow } from './windows'

const debug = debugFactory('halland-proxy:main')

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

  createMainWindow()
  const proxyWindow = createProxyWindow()
  proxyWindow.on('ready-to-show', () => {
    sendToProxyWindow(START_PROXY)
    if (process.env['DEBUG']) {
      proxyWindow.show()
      proxyWindow.toggleDevTools()
    }
  })
})
