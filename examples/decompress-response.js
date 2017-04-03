const zlib = require('zlib')

module.exports = function decompressResponse (request, response) {
  return {
    responsePipe: function (proxyResponse) {
      switch (proxyResponse.headers['content-encoding']) {
        case 'gzip':
          delete proxyResponse.headers['content-encoding']
          delete proxyResponse.headers['content-length']
          proxyResponse.headers['transfer-encoding'] = 'chunked'
          return zlib.createGunzip()
        case 'deflate':
          delete proxyResponse.headers['content-encoding']
          delete proxyResponse.headers['content-length']
          proxyResponse.headers['transfer-encoding'] = 'chunked'
          return zlib.createInflate()
        default:
          return null
      }
    }
  }
}
