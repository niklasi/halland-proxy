import createProxy from './lib/proxy'
import openDb from './db'
import { load as loadConfig } from './lib/config'
import { loadPlugins, updatePlugins, syncPlugins } from './plugins'
import { remote, ipcRenderer as ipc } from 'electron'
import { START_PROXY, ADD_REQUEST, ADD_RESPONSE, HTTP_MESSAGE_DETAILS, SEND_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'
import debugFactory from 'debug'

const debug = debugFactory('halland-proxy:proxy')

debug('Load config...')
const config = loadConfig()

syncPlugins(config.plugins)

debug('Open database...')
const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

ipc.on('update-plugins', (evt, windowId) => {
  debug('Update plugins...')
  updatePlugins((err) => {
    if (err) {
      debug('Error when installing plugins...', err)
    } else {
      debug('Plugins installed successfully...')
    }
  })
})

let win
ipc.on(START_PROXY, (evt, windowId) => {
  win = remote.BrowserWindow.fromId(windowId)
  startProxy()
})

function startProxy () {
  debug('Prepare to start proxy...')
  const plugins = loadPlugins(config.plugins)
  debug('Loaded plugins...', plugins)

  const options = {
    port: config.port,
    requestSetup: plugins.requestSetup,
    requestStart: (request) => {
      db.put(`${request.id}!request`, request)
      win.webContents.send(ADD_REQUEST, request)
    },
    requestPipe: plugins.requestPipe,
    responseHeaders: plugins.responseHeaders,
    responsePipe: plugins.responsePipe,
    responseDone: (response) => {
      db.put(`${response.id}!response`, response)
      delete response.body
      win.webContents.send(ADD_RESPONSE, response)
    }
  }

  debug('Create proxy with options...', options)
  createProxy(options, (err) => {
    if (err) throw err
    debug(`Proxy server started on port ${options.port}...`)
  })
}

ipc.on(SEND_HTTP_MESSAGE_DETAILS, (e, requestId) => {
  db.get(`${requestId}!request`, (err, request) => {
    if (err) debug(err)
    db.get(`${requestId}!response`, (err, response) => {
      if (err) debug(err)
      debug('Send http message details...')
      win.webContents.send(HTTP_MESSAGE_DETAILS, { request, response })
    })
  })
})
