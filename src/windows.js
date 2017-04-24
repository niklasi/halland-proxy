import { remote, BrowserWindow } from 'electron'
import { resolve } from 'path'
import ip from 'ip'
import debugFactory from 'debug'

const debug = debugFactory('halland-proxy:main')

const PROXY_SERVER_TITLE = 'proxy-server'
const MAIN_WINDOW_TITLE = 'halland-proxy'
let mainWindow = null
let proxyWindow = null

export function createMainWindow () {
  if (mainWindow) return mainWindow

  mainWindow = createWindow({width: 968, height: 800, titleBarStyle: 'hidden-inset', title: MAIN_WINDOW_TITLE + ' ' + ip.address()})
  mainWindow.loadURL('file://' + resolve(__dirname, 'renderer/index.html'))
  mainWindow.on('close', () => {
    mainWindow = null
  })

  return mainWindow
}

export function createProxyWindow () {
  if (proxyWindow) return proxyWindow

  proxyWindow = createWindow({width: 300, height: 300, show: false, title: PROXY_SERVER_TITLE})
  proxyWindow.loadURL('file://' + resolve(__dirname, 'proxy.html'))
  proxyWindow.on('close', () => {
    proxyWindow = null
  })

  return proxyWindow
}

export function sendToMainWindow (channel, ...args) {
  sendToWindow(getMainWindow(), channel, ...args)
}

export function sendToProxyWindow (channel, ...args) {
  sendToWindow(getProxyWindow(), channel, ...args)
}

function sendToWindow (win, channel, ...args) {
  win.webContents.send(channel, ...args)
}

export function getMainWindow () {
  if (mainWindow) return mainWindow

  mainWindow = remote.BrowserWindow.getAllWindows()
    .find(x => x.getTitle() === MAIN_WINDOW_TITLE + ' ' + ip.address())

  return mainWindow
}

export function getProxyWindow () {
  if (proxyWindow) return proxyWindow

  proxyWindow = remote.BrowserWindow.getAllWindows()
    .find(x => x.getTitle() === PROXY_SERVER_TITLE)

  return proxyWindow
}

function createWindow (options) {
  const win = new BrowserWindow(options)

  win.on('unresponsive', () => {
    debug(`${win.title} is unresponsive...`)
  })

  win.webContents.on('crashed', (evt, killed) => {
    debug(`${win.title} is unresponsive...`)
  })

  // win.on('close', () => {
  //   Object.keys(windows)
  //     .map(x => windows[x])
  //     .filter(x => x !== win)
  //     .filter(x => x !== null)
  //     .forEach(x => {
  //       x.close()
  //     })
  // })

  return win
}
