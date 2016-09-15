const http = require('http')
const url = require('url')
const net = require('net')

module.exports = ({ port = 8888 }) => {
  console.log(port)
  return {
    listen: (cb) => {
      proxy.listen(port, cb)
    }
  }
}

const proxy = http.createServer(function (request, response) {
  const options = {
    hostname: request.headers.host,
    method: request.method,
    headers: request.headers,
    path: request.url
  }

  let proxyRequest = http.request(options)
  proxyRequest.on('response', function (proxyResponse) {
    proxyResponse.pipe(response)
  })
  request.pipe(proxyRequest)
})

proxy.on('connect', (req, cltSocket, head) => {
  const srvUrl = url.parse(`https://${req.url}`)
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Halland-Proxy\r\n' +
      '\r\n')
    srvSocket.write(head)
    srvSocket.pipe(cltSocket)
    cltSocket.pipe(srvSocket)
  })
})
