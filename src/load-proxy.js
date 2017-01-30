import createProxy from './lib/proxy'
import openDb from './db'
import { load as loadConfig } from './lib/config'
import { loadPlugins, updatePlugins, syncPlugins } from './plugins'
import electron, { ipcMain as ipc } from 'electron'
import { ADD_REQUEST, ADD_RESPONSE, HTTP_MESSAGE_DETAILS, REQUEST_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'
import debugFactory from 'debug'
import { generateRootCA, loadRootCA } from './lib/ca'
import { existsSync, writeFile } from 'fs'
import { resolve } from 'path'
import async from 'async'

const debug = debugFactory('halland-proxy:proxy')
const app = electron.app || electron.remote.app
const certPath = app.getPath('userData')

debug('Load config...')
const config = loadConfig()

syncPlugins(config.plugins)

debug('Open database...')
const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

// ipc.on('update-plugins', (evt, windowId) => {
debug('aaa', aaa)

function aaa () {
  debug('Update plugins...')
  updatePlugins((err) => {
    if (err) {
      debug('Error when installing plugins...', err)
    } else {
      debug('Plugins installed successfully...')
    }
  })
}

let win
// ipc.on(START_PROXY, (evt, windowId) => {
export default function loadProxy (browserWindow) {
  win = browserWindow
  if (existsSync(resolve(certPath, 'halland-proxy-ca.pem'))) {
    debug('Halland-Proxy root cert exists...')
    startProxy()
  } else {
    debug('Generate Halland-Proxy root cert...')
    generateRootCA((err, ca) => {
      if (err) throw err
      async.parallel([
        writeFile.bind(null, resolve(certPath, 'halland-proxy-ca.pem'), ca.pemCertificate),
        writeFile.bind(null, resolve(certPath, 'halland-proxy-ca.private.key'), ca.pemPrivateKey),
        writeFile.bind(null, resolve(certPath, 'halland-proxy-ca.public.key'), ca.pemPublicKey)
      ], (err, result) => {
        if (err) throw err
        debug('Halland-Proxy root cert created...')
        startProxy()
      })
    })
  }
}

function startProxy () {
  debug('Prepare to start proxy...')
  const plugins = loadPlugins(config.plugins)
  debug('Loaded plugins...', plugins)

  loadRootCA(certPath, (err, ca) => {
    if (err) throw err
    const options = {
      port: config.port,
      ca,
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
  })
}

ipc.on(REQUEST_HTTP_MESSAGE_DETAILS, (e, requestId) => {
  db.get(`${requestId}!request`, (err, request) => {
    if (err) debug(err)
    db.get(`${requestId}!response`, (err, response) => {
      if (err) debug(err)
      debug('Send http message details...')
      win.webContents.send(HTTP_MESSAGE_DETAILS, { request, response })
    })
  })
})
