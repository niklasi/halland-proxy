const {app, BrowserWindow} = require('electron')

let win = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  win = new BrowserWindow({width: 1200, height: 800})

  win.loadURL('file://' + __dirname + '/index.html')
  win.openDevTools()

  win.on('closed', function () {
    // proxy.close()
    win = null
  })
})
