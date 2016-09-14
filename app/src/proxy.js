const http = require('http')
const url = require('url')
const net = require('net')

module.exports = () => {
  return proxy
}

const proxy = http.createServer(function (request, response) {
  var options = {
    hostname: request.headers.host,
    method: request.method,
    headers: request.headers,
    path: request.url
  }

  var proxyRequest = http.request(options)
  proxyRequest.on('response', function (proxyResponse) {
    proxyResponse.pipe(response)
  })
  request.pipe(proxyRequest)
})

proxy.on('connect', (req, cltSocket, head) => {
  var srvUrl = url.parse(`https://${req.url}`)
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Halland-Proxy\r\n' +
      '\r\n')
    srvSocket.write(head)
    srvSocket.pipe(cltSocket)
    cltSocket.pipe(srvSocket)
  })
})
