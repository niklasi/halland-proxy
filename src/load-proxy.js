import createProxy from './lib/proxy'
import openDb from './db'
import { load as loadConfig } from './lib/config'
import loadPlugins from './plugins'
import through from 'through2'
import { remote, ipcRenderer as ipc } from 'electron'
import { START_PROXY, ADD_REQUEST, ADD_RESPONSE, HTTP_MESSAGE_DETAILS, SEND_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'
import debugFactory from 'debug'

const debug = debugFactory('halland-proxy:proxy')

debug('Load config...')
const config = loadConfig()
debug('Open database...')
const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

let win
ipc.on(START_PROXY, (evt, windowId) => {
  debug('Prepare to start proxy...')
  const plugins = loadPlugins(config)
  debug('Loaded plugins...', plugins)
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
  debug('Create proxy with options...', options)

  createProxy(options, (err) => {
    if (err) throw err
    debug(`Proxy server started on port ${options.port}...`)
  })
})

ipc.on(SEND_HTTP_MESSAGE_DETAILS, (e, requestId) => {
  db.get(`${requestId}!request!meta`, (err, request) => {
    if (err) debug(err)
    db.get(`${requestId}!response!meta`, (err, response) => {
      if (err) debug(err)
      debug('Send http message details...')
      win.webContents.send(HTTP_MESSAGE_DETAILS, { request, response })
    })
  })
})
