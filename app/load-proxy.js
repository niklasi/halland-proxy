const createProxy = require('./lib/proxy')
const openDb = require('./db')
const config = require('./lib/config').load()
const loadPlugins = require('./plugins')
const through = require('through2')
const BrowserWindow = require('electron').remote.BrowserWindow
const ipc = require('electron').ipcRenderer

const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

ipc.on('start-proxy', (evt, windowId) => {
  const plugins = loadPlugins(config)
  const win = BrowserWindow.fromId(windowId)

  const options = {
    port: config.port,
    requestSetup: plugins.requestSetup,
    requestStart: (request) => {
      db.put(`${request.id}!request!meta`, request)
      win.webContents.send('add-request', request)
    },
    requestPipe: plugins.requestPipe,
    responseHeaders: plugins.responseHeaders,
    responsePipe: [
      (request, responseHeaders) => {
        let chunkIndex = 0
        return through(function (chunk, enc, cb) {
          db.put(`${request.id}!response!body!${chunkIndex}`, chunk)
          chunkIndex += 1
          this.push(chunk)
          cb()
        })
      }].concat(plugins.responsePipe),
    responseDone: (response) => {
      db.put(`${response.id}!response!meta`, response)
      delete response.body
      win.webContents.send('add-response', response)
    }
  }

  createProxy(options, (err) => {
    if (err) throw err
    console.log(`Server started on port ${options.port}...`)
  })
})
