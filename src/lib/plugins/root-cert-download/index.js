import electron from 'electron'
const fs = require('fs')
const { resolve } = require('path')

const app = electron.app || electron.remote.app
const certPath = app.getPath('userData')

module.exports = function downloadRootCert (request, response) {
  return {
    requestSetup: function (requestOptions, next) {
      if (requestOptions.href !== 'http://bit.ly/hlnd-tls') return next()

      response.setHeader('content-type', 'octet/stream')
      response.setHeader('content-disposition', 'attachment; filename="halland-proxy-ca.pem"')
      response.statusCode = 200
      response.statusMessage = 'OK'
      fs.createReadStream(resolve(certPath, 'halland-proxy-ca.pem')).pipe(response)
    }
  }
}
