const http = require('http')
const request = require('request')
const createProxy = require('../app/lib/proxy')
const tap = require('tap')

const setup = (options, cb) => {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  options.port = options.port || 0
  const server = http.createServer()

  const serverStarted = () => {
    createProxy(options, proxyStarted)
  }

  const proxyStarted = (err, proxy) => {
    if (err) tap.bailout('can not create proxy...')
    server.on('close', proxy.close.bind(proxy))

    return cb(null, {
      request: request.defaults({'proxy': 'http://127.0.0.1:' + proxy.address().port}),
      server
    })
  }

  server.listen(0, serverStarted)
}

module.exports.setup = setup
