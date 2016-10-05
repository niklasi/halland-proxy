const http = require('http')
const url = require('url')
const net = require('net')
const through = require('through2')

const noop = () => {}
const noopStream = () => {
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
  port = 0,
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
      const requestInfo = url.parse(request.url)

      const defaultOptions = {
        hostname: requestInfo.hostname,
        port: requestInfo.port,
        method: request.method,
        headers: request.headers,
        path: request.url
      }

      const id = nextId(request.url)

      const options = requestSetup.reduce((o, transform) => {
        return transform(o)
      }, defaultOptions)

      let proxyRequest = http.request(options)

      const onResponse = (proxyResponse) => {
        const headers = responseHeaders.reduce((headers, transform) => {
          return transform(headers)
        }, proxyResponse.headers)

        transformHeaders(headers).forEach(header => response.setHeader(header.key, header.value))

        responsePipe.reduce((r, p) => {
          const transform = p(requestData, headers) || noopStream()
          return r.pipe(transform)
        }, proxyResponse).pipe(response)

        response.on('finish', () => {
          responseDone({
            id,
            headers,
            statusCode: proxyResponse.statusCode,
            statusMessage: proxyResponse.statusMessage
          })
        })
      }

      proxyRequest.on('response', onResponse)
      const { hostname, method, headers, port } = options

      const requestData = { id, hostname, method, headers, port, url: options.path }
      requestStart(requestData)

      requestPipe.reduce((r, p) => {
        const transform = p() || noopStream()
        return r.pipe(transform)
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
  proxy.listen(port, () => {
    if (cb) return cb(null, proxy)
  })
}
