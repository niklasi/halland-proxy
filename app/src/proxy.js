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

module.exports = ({
  port = 8888,
  requestSetup = [],
  requestStart = noop,
  requestPipe = [],
  responseHeaders = [],
  responsePipe = [],
  responseDone = noop },
  cb) => {
  const createProxy = () => {
    const requestCounter = new Map()

    const nextId = (url) => {
      let counter = requestCounter.get(url) || 0
      requestCounter.set(url, ++counter)
      return `${url}-${counter}`
    }

    const proxy = http.createServer((request, response) => {
      const defaultOptions = {
        hostname: request.headers.host,
        method: request.method,
        headers: request.headers,
        path: request.url
      }

      const id = nextId(request.url)
      console.log('id', id)

      const options = requestSetup.reduce((o, transform) => {
        return transform(o)
      }, defaultOptions)

      let proxyRequest = http.request(options)

      proxyRequest.on('response', (proxyResponse) => {
        const headers = responseHeaders.reduce((headers, transform) => {
          return transform(headers)
        }, proxyResponse.headers)

        transformHeaders(headers).forEach(header => response.setHeader(header.key, header.value))

        responsePipe.reduce((r, p) => {
          return r.pipe(p(requestData, headers) || createNoopStream())
        }, proxyResponse).pipe(response)

        response.on('finish', () => {
          responseDone({
            id,
            headers,
            statusCode: proxyResponse.statusCode,
            statusMessage: proxyResponse.statusMessage
          })
        })
      })

      const { hostname, method } = options

      const requestData = { id, hostname, method, headers: options.headers, url: options.path }
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

  const proxy = createProxy()
  proxy.listen(port, cb)
}
