const zlib = require('zlib')

module.exports = function decompressResponse () {
  return {
    responsePipe: [
      (requestInfo, responseHeaders) => {
        switch (responseHeaders['content-encoding']) {
          case 'gzip':
            delete responseHeaders['content-encoding']
            delete responseHeaders['content-length']
            responseHeaders['transfer-encoding'] = 'chunked'
            return zlib.createGunzip()
          case 'deflate':
            delete responseHeaders['content-encoding']
            delete responseHeaders['content-length']
            responseHeaders['transfer-encoding'] = 'chunked'
            return zlib.createInflate()
          default:
            return null
        }
      }
    ]
  }
}
