const http = require('http')
const { parse: urlParser } = require('url')
const net = require('net')
const through = require('through2')

const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

const createProxy = ({ createRequestOptions, requestStart, createRequestPipe, createResponseHeaders, createResponsePipe, responseDone }) => {
  const requestCounter = new Map()

  const nextId = (url) => {
    let counter = requestCounter.get(url) || 0
    requestCounter.set(url, ++counter)
    return `${url}-${counter}`
  }

  const proxy = http.createServer((request, response) => {
    const defaultRequestOptions = Object.assign({
      headers: request.headers,
      method: request.method,
      httpVersion: request.httpVersion
    }, urlParser(request.url))

    const id = nextId(request.url)

    const requestOptions = createRequestOptions(defaultRequestOptions)

    const proxyRequest = http.request(requestOptions)
      .on('response', (proxyResponse) => {
        const headers = createResponseHeaders(proxyResponse.headers)

        transformHeaders(headers).forEach(header => response.setHeader(header.key, header.value))

        const responseData = []
        createResponsePipe(proxyResponse, requestData, headers)
          .on('data', (data) => responseData.push(data))
          .pipe(response)

        response.on('finish', () => responseDone({ id, headers, statusCode: proxyResponse.statusCode, statusMessage: proxyResponse.statusMessage, body: Buffer.concat(responseData) }))
      })

    const { hostname, method, headers, port, href: url } = requestOptions

    const requestData = { id, hostname, method, headers, port, url }
    requestStart(requestData)

    createRequestPipe(request).pipe(proxyRequest)
  })

  proxy.on('connect', (req, cltSocket, head) => {
    const srvUrl = urlParser(`https://${req.url}`)
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

const noopStream = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

const createRequestOptions = (requestSetup) => {
  return (defaultRequestOptions) => requestSetup.reduce((o, transform) => { return transform(o) }, defaultRequestOptions)
}

const createRequestPipe = (requestPipe) => {
  return (request) => requestPipe.reduce((r, p) => {
    return r.pipe(p() || noopStream())
  }, request)
}

const createResponseHeaders = (responseHeaders) => {
  return (proxyResponseHeaders) => responseHeaders.reduce((headers, transform) => { return transform(headers) }, proxyResponseHeaders)
}

const createResponsePipe = (responsePipe) => {
  return (proxyResponse, requestData, headers) => {
    return responsePipe.reduce((r, p) => {
      return r.pipe(p(requestData, headers) || noopStream())
    }, proxyResponse)
  }
}

const noop = () => {}

module.exports = ({ port = 0, requestSetup = [], requestStart = noop, requestPipe = [], responseHeaders = [], responsePipe = [], responseDone = noop }, cb) => {
  const options = {
    createRequestOptions: createRequestOptions(requestSetup),
    requestStart,
    createRequestPipe: createRequestPipe(requestPipe),
    createResponseHeaders: createResponseHeaders(responseHeaders),
    createResponsePipe: createResponsePipe(responsePipe),
    responseDone
  }

  const proxy = createProxy(options)

  proxy.listen(port, () => {
    if (cb) return cb(null, proxy)
  })
}
