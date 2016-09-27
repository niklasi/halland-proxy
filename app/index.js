const {app, BrowserWindow, globalShortcut} = require('electron')

let win = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  win = new BrowserWindow({width: 640, height: 800})

  win.loadURL('file://' + __dirname + '/index.html')

  globalShortcut.register('f12', function () {
    win.toggleDevTools()
  })

  win.on('closed', function () {
    // proxy.close()
    win = null
  })
})
