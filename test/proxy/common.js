import http from 'http'
import request from 'request'
import createProxy from '../../src/lib/proxy'
import tap from 'tap'

function setup (options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  const server = http.createServer()

  const serverStarted = () => {
    createProxy(options, proxyStarted)
  }

  const proxyStarted = (err, proxies) => {
    if (err) tap.bailout('can not create proxy...')
    server.on('close', proxies[0].close.bind(proxies[0]))
    server.on('close', proxies[1].close.bind(proxies[1]))

    return cb(null, {
      request: request.defaults({'proxy': 'http://127.0.0.1:' + proxies[0].address().port}),
      server
    })
  }

  server.listen(0, serverStarted)
}

export default { setup }
