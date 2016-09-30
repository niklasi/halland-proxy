const http = require('http')
const url = require('url')
const net = require('net')
const through = require('through2')

const noop = () => {}
const createNoopStream = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

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

      proxyRequest.on('response', (proxyResponse) => {
        const headers = transformHeaders(proxyResponse.headers)
        headers.forEach(header => response.setHeader(header.key, header.value))

        responsePipe.reduce((proxyResp, pipe) => {
          return proxyResp.pipe(pipe(requestData, proxyResponse.headers) || createNoopStream())
        }, proxyResponse).pipe(response)

        response.on('finish', () => {
          responseDone({
            id: options.path,
            headers,
            statusCode: proxyResponse.statusCode,
            statusMessage: proxyResponse.statusMessage
          })
        })
      })

      const { hostname, method } = options
      const headers = transformHeaders(options.headers)

      const requestData = { id: options.path, hostname, method, headers, url: options.path }
      requestStart(requestData)

      requestPipe.reduce((r, p) => {
        return r.pipe(p() || createNoopStream())
      }, request).pipe(proxyRequest)
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
