import { homedir } from 'os'
import { resolve, basename } from 'path'
import { exec } from 'child_process'
import { writeFileSync } from 'fs'
import mkdirp from 'mkdirp'
import debugFactory from 'debug'
import shellEnv from 'shell-env'

const debug = debugFactory('halland-proxy:plugins')

function getPluginDir () {
  const pluginDir = resolve(homedir(), '.halland-proxy-plugins')
  mkdirp.sync(pluginDir)
  return pluginDir
}

export function syncPlugins (plugins = []) {
  const packageJsonPath = resolve(getPluginDir(), 'package.json')
  const packageJson = require(packageJsonPath)
  plugins.forEach(p => (packageJson.dependencies[p] = 'latest'))

  writeFileSync(packageJsonPath, JSON.stringify(packageJson))
}

export function loadPlugins (plugins = []) {
  const pluginDir = getPluginDir()
  const paths = plugins.map(plugin => {
    return resolve(pluginDir, 'node_modules', plugin.split('#')[0])
  })

  const pluginSetup = {
    requestSetup: [],
    requestPipe: [],
    responseHeaders: [],
    responsePipe: []
  }

  paths.forEach(path => {
    let plugin
    const name = basename(path)
    try {
      plugin = require(path)()
    } catch (err) {
      debug(`Failed to load plugin ${name}.`)
    }
    plugin = plugin || {}
    plugin.requestSetup = plugin.requestSetup || []
    plugin.requestPipe = plugin.requestPipe || []
    plugin.responseHeaders = plugin.responseHeaders || []
    plugin.responsePipe = plugin.responsePipe || []

    pluginSetup.requestSetup = [...pluginSetup.requestSetup, ...plugin.requestSetup]
    pluginSetup.requestPipe = [...pluginSetup.requestPipe, ...plugin.requestPipe]
    pluginSetup.responseHeaders = [...pluginSetup.responseHeaders, ...plugin.responseHeaders]
    pluginSetup.responsePipe = [...pluginSetup.responsePipe, ...plugin.responsePipe]
  })

  return plugins
}

export function updatePlugins (cb) {
  shellEnv().then(env => {
    env.npm_config_runtime = 'electron'
    env.npm_config_target = process.versions.electron
    env.npm_config_disturl = 'https://atom.io/download/atom-shell'
    exec('npm prune && npm install --production', {
      cwd: getPluginDir(),
      env
    }, err => {
      if (err) {
        return cb(err)
      }
      cb(null)
    })
  }).catch(cb)
}

