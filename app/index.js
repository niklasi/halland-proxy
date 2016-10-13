const {app, BrowserWindow, globalShortcut} = require('electron')
const { resolve } = require('path')

let win = null
let proxy = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  win = new BrowserWindow({width: 640, height: 800, titleBarStyle: 'hidden-inset'})
  win.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))

  proxy = new BrowserWindow({width: 400, height: 400})
  proxy.loadURL('file://' + resolve(__dirname, 'proxy.html'))

  globalShortcut.register('f12', function () {
    win.toggleDevTools()
    proxy.toggleDevTools()
  })

  win.on('closed', function () {
    win = null
  })
})
