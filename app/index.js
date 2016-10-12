const {app, BrowserWindow, globalShortcut} = require('electron')
const { resolve } = require('path')

let win = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  win = new BrowserWindow({width: 640, height: 800, titleBarStyle: 'hidden-inset'})
  win.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))

  globalShortcut.register('f12', function () {
    win.toggleDevTools()
  })

  win.on('closed', function () {
    win = null
  })
})
