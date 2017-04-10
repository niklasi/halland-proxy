import createProxy from './lib/proxy'
import openDb from './db'
import { load as loadConfig } from './lib/config'
import { loadPlugins, syncPlugins } from './plugins'
import electron, { remote, ipcRenderer as ipc } from 'electron'
import { START_PROXY, ADD_REQUEST, ADD_RESPONSE, HTTP_MESSAGE_DETAILS, REQUEST_HTTP_MESSAGE_DETAILS } from './constants/ipcMessages'
import debugFactory from 'debug'
import { generateRootCA, loadRootCA } from './lib/ca'
import { existsSync, writeFile } from 'fs'
import { resolve } from 'path'
import async from 'async'

const debug = debugFactory('halland-proxy:proxy')
const app = electron.app || electron.remote.app

debug('Load config...')
const config = loadConfig()

syncPlugins(config.plugins)

debug('Open database...')
const db = openDb({path: config.db.path, backingStore: config.db.backingStore})

let win

ipc.on(START_PROXY, (e, windowId) => {
  debug('Start proxy requested...')
  win = remote.BrowserWindow.fromId(windowId)
  startProxy()
})

function startProxy () {
  debug('Prepare to start proxy...')

  async.waterfall([
    prepareRootCA,
    loadRootCA,
    setupProxyOptions,
    createProxy
  ], (err, proxies) => {
    if (err) throw err

    debug(`Http proxy server started on port ${proxies[0].address().port}...`)
    debug(`Https proxy server started on port ${proxies[1].address().port}...`)
  })
}

function prepareRootCA (cb) {
  const certPath = app.getPath('userData')
  if (existsSync(resolve(certPath, 'halland-proxy-ca.pem'))) {
    debug('Halland-Proxy root cert exists...')
    return cb(null, certPath)
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
        return cb(err, certPath)
      })
    })
  }
}

function setupProxyOptions (ca, cb) {
  const plugins = loadPlugins(config.plugins)
  debug('Loaded plugins...', plugins)
  const options = {
    port: config.port,
    ca,
    plugins,
    requestStart: (requestOptions) => {
      db.put(`${requestOptions.id}!request`, requestOptions)
      win.webContents.send(ADD_REQUEST, requestOptions)
    },
    responseDone: (response) => {
      db.put(`${response.id}!response`, response)
      delete response.body
      win.webContents.send(ADD_RESPONSE, response)
    }
  }

  return cb(null, options)
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
