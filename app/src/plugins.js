const zlib = require('zlib')
const through = require('through2')

module.exports = {
  requestSetup: [
    (options) => {
      options.path += '?output=json'
      return options
    },
    (options) => {
      options.path += '&you=niklas'
      return options
    }
  ],
  requestPipe: [
  ],
  responseHeaders: [
    (headers) => {
      headers['x-proxy-agent'] = 'Halland-Proxy'
      return headers
    },
    (headers) => {
      headers['x-company'] = 'Layer 10'
      return headers
    }
  ],
  responsePipe: [
    (request, responseHeaders) => {
      switch (responseHeaders['content-encoding']) {
        case 'gzip':
          return zlib.createGunzip()
        case 'deflate':
          return zlib.createInflate()
        default:
          return null
      }
    },
    (request, responseHeaders) => {
      return through(function (chunk, enc, cb) {
        this.push(chunk)
        cb()
      })
    },
    (request, responseHeaders) => {
      switch (responseHeaders['content-encoding']) {
        case 'gzip':
          return zlib.createGzip()
        case 'deflate':
          return zlib.createDeflate()
        default:
          return null
      }
    }
  ]
}
