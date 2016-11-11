import createProxy from './lib/proxy'
import openDb from './db'
import { load as loadConfig } from './lib/config'
import loadPlugins from './plugins'
import through from 'through2'
import { remote, ipcRenderer as ipc } from 'electron'
import { START_PROXY, ADD_REQUEST, ADD_RESPONSE, REQUEST_DETAILS, SEND_REQUEST_DETAILS } from './constants/ipcMessages'

const config = loadConfig()
const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

let win
ipc.on(START_PROXY, (evt, windowId) => {
  const plugins = loadPlugins(config)
  win = remote.BrowserWindow.fromId(windowId)

  const options = {
    port: config.port,
    requestSetup: plugins.requestSetup,
    requestStart: (request) => {
      db.put(`${request.id}!request!meta`, request)
      win.webContents.send(ADD_REQUEST, request)
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
      win.webContents.send(ADD_RESPONSE, response)
    }
  }

  createProxy(options, (err) => {
    if (err) throw err
    console.log(`Server started on port ${options.port}...`)
  })
})

ipc.on(SEND_REQUEST_DETAILS, (e, requestId) => {
  db.get(`${requestId}!request!meta`, (err, request) => {
    if (err) console.log(err)
    db.get(`${requestId}!response!meta`, (err, response) => {
      if (err) console.log(err)
      win.webContents.send(REQUEST_DETAILS, { request, response })
    })
  })
})
