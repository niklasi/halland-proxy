const { homedir } = require('os')
const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const vm = require('vm')

const path = resolve(homedir(), '.halland-proxy.js')

function loadConfig (str) {
  const script = new vm.Script(str)
  const module = {}
  script.runInNewContext({ module })
  if (!module.exports) {
    throw new Error('Error reading configuration: `module.exports` not set')
  }
  return module.exports
}

module.exports = () => {
  let config
  try {
    config = loadConfig(readFileSync(path, 'utf8'))
  } catch (err) {
    console.log('read error', path, err.message)
    const defaultConfig = readFileSync(resolve(__dirname, 'config-default.js'))
    try {
      console.log('attempting to write default config to', path)
      config = loadConfig(defaultConfig)
      writeFileSync(path, defaultConfig)
    } catch (err) {
      throw new Error(`Failed to write config to ${path}`)
    }
  }

  return config
}
