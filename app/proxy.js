const proxy = require('http-mitm-proxy')()

module.exports = () => {
  return proxy
}
