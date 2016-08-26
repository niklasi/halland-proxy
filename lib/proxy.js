// TODO: Fix this hack...
// Use Electrons require instead of webpack...
const proxy = window.require('http-mitm-proxy')()

module.exports = () => {
  return proxy
}
