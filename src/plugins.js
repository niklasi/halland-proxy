import { homedir } from 'os'
import { resolve, basename } from 'path'
import { exec } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import mkdirp from 'mkdirp'
import debugFactory from 'debug'
import shellEnv from 'shell-env'
import defaultPlugins from './lib/plugins'

const debug = debugFactory('halland-proxy:plugins')

const defaultPluginPackageJson = {
  name: 'halland-proxy-plugins',
  version: '1.0.0',
  description: 'Plugins for Halland Proxy.',
  dependencies: []
}

function getPluginDir () {
  const pluginDir = resolve(homedir(), '.halland-proxy-plugins')
  mkdirp.sync(pluginDir)
  return pluginDir
}

export function syncPlugins (plugins = []) {
  const packageJsonPath = resolve(getPluginDir(), 'package.json')
  let packageJson = null
  if (existsSync(packageJsonPath)) {
    packageJson = require(packageJsonPath)
  } else {
    packageJson = Object.assign({}, defaultPluginPackageJson)
  }

  packageJson.dependencies = []
  plugins.forEach(p => (packageJson.dependencies[p] = 'latest'))

  writeFileSync(packageJsonPath, JSON.stringify(packageJson))
}

export function loadPlugins (pluginNames = []) {
  const pluginDir = getPluginDir()
  const plugins = pluginNames
    .map(name => resolve(pluginDir, 'node_modules', name.split('#')[0]))
    .map(pluginPath => {
      try {
        return require(pluginPath)()
      } catch (err) {
        debug(`Failed to load plugin ${basename(pluginPath)}.`)
      }
    })
    .concat(defaultPlugins)

  return plugins.map(x => x || {})
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
