const {app, BrowserWindow} = require('electron')
// var shortcut = require('global-shortcut')

let mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.openDevTools()

  // shortcut.register('f12', function () {
  //   mainWindow.toggleDevTools()
  // })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
