const http = require('http')
const url = require('url')
const net = require('net')

const noop = () => {}
const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

module.exports = ({ port = 8888, requestStart = noop, requestPipe = [], responsePipe = [], responseDone = noop }, cb) => {
  const createProxy = () => {
    const proxy = http.createServer((request, response) => {
      const options = {
        hostname: request.headers.host,
        method: request.method,
        headers: request.headers,
        path: request.url
      }

      let proxyRequest = http.request(options)

      // const _writeRawReq = proxyRequest._writeRaw.bind(proxyRequest)
      // proxyRequest._writeRaw = (data, encoding, callback) => {
      //   // console.log(data.toString())
      //   _writeRawReq(data, encoding, callback)
      // }

      // const _writeRaw = response.socket.write.bind(response.socket)
      // response.socket.write = (data, encoding, callback) => {
      //   // console.log(data.toString())
      //   _writeRaw(data, encoding, callback)
      // }

      proxyRequest.on('response', (proxyResponse) => {
        responsePipe.forEach(pipe => {
          proxyResponse.pipe(pipe(requestData))
        })

        const headers = transformHeaders(proxyResponse.headers)
        headers.forEach(header => response.setHeader(header.key, header.value))

        response.on('finish', () => {
          responseDone({
            id: options.path,
            headers,
            statusCode: proxyResponse.statusCode,
            statusMessage: proxyResponse.statusMessage
          })
        })

        proxyResponse.pipe(response)
      })

      requestPipe.forEach(pipe => {
        request.pipe(pipe())
      })

      const { hostname, method } = options
      const headers = transformHeaders(options.headers)

      const requestData = { id: options.path, hostname, method, headers, url: options.path }
      requestStart(requestData)
      request.pipe(proxyRequest)
    })

    proxy.on('connect', (req, cltSocket, head) => {
      const srvUrl = url.parse(`https://${req.url}`)
      console.log('connect', srvUrl)
      const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
          'Proxy-agent: Halland-Proxy\r\n' +
          '\r\n')
        srvSocket.write(head)
        srvSocket.pipe(cltSocket)
        cltSocket.pipe(srvSocket)
      })
    })

    return proxy
  }

  const proxy = createProxy(requestStart, requestPipe, responsePipe)
  proxy.listen(port, cb)
}
