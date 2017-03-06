import electron from 'electron'
const fs = require('fs')
const { resolve } = require('path')

const app = electron.app || electron.remote.app
const certPath = app.getPath('userData')

module.exports = function downloadRootCert () {
  return {
    responsePipe: [
      function rootCertPipe (requestInfo, responseHeaders) {
        if (requestInfo.href === 'http://bit.ly/hlnd-tls') {
          responseHeaders['content-type'] = 'octet/stream'
          responseHeaders['Content-Disposition'] = 'attachment; filename="halland-proxy-ca.pem"'
          delete responseHeaders.location
          delete responseHeaders.server
          delete responseHeaders['set-coookie']
          return fs.createReadStream(resolve(certPath, 'halland-proxy-ca.pem'))
        }
      }
    ]
  }
}
