import http from 'http'
import request from 'request'
import createProxy from '../../app/lib/proxy'
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

export default { setup }
