import { homedir } from 'os'
import { resolve, basename } from 'path'
import mkdirp from 'mkdirp'

export default (config) => {
  const pluginDir = resolve(homedir(), '.halland-proxy-plugins')

  mkdirp.sync(pluginDir)

  const paths = config.plugins.map(plugin => {
    return resolve(pluginDir, 'node_modules', plugin.split('#')[0])
  })

  const plugins = {
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
      console.log(`Failed to load plugin ${name}.`)
    }
    plugin = plugin || {}
    plugins.requestSetup = [...plugins.requestSetups, ...plugin.requestSetup]
    plugins.requestPipe = [...plugins.requestPipe, ...plugin.requestPipe]
    plugins.responseHeaders = [...plugins.responseHeaders, ...plugin.responseHeaders]
    plugins.responsePipe = [...plugins.responsePipe, ...plugin.responsePipe]
  })

  return plugins
}

