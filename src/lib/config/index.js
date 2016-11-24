import { homedir } from 'os'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import vm from 'vm'
import { shell } from 'electron'

const path = resolve(homedir(), '.halland-proxy.js')

function makeModule (str) {
  const script = new vm.Script(str)
  const module = {}
  script.runInNewContext({ module })
  if (!module.exports) {
    throw new Error('Error reading configuration: `module.exports` not set')
  }
  return module.exports
}

const load = () => {
  let config
  try {
    config = makeModule(readFileSync(path, 'utf8'))
  } catch (err) {
    console.log('read error', path, err.message)
    const defaultConfig = readFileSync(resolve(__dirname, 'config-default.js'))
    try {
      console.log('attempting to write default config to', path)
      config = makeModule(defaultConfig)
      writeFileSync(path, defaultConfig)
    } catch (err) {
      throw new Error(`Failed to write config to ${path}`)
    }
  }

  return config
}

const open = () => {
  shell.openItem(path)
}

module.exports = { load, open }
