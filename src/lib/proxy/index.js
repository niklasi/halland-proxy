import http from 'http'
import https from 'https'
import { parse as urlParser } from 'url'
import net from 'net'
import through from 'through2'
import debugFactory from 'debug'
import generateServerCertificate from './generateServerCertificate'

const debug = debugFactory('halland-proxy:proxy')

const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

const createProxy = ({ ca, createRequestOptions, requestStart, createRequestPipe, createResponseHeaders, createResponsePipe, responseDone }) => {
  const requestCounter = new Map()

  const nextId = (url) => {
    let counter = requestCounter.get(url) || 0
    requestCounter.set(url, ++counter)
    return `${url}-${counter}`.replace(/\.|\?|:|\//g, '-')
  }

  const httpProxy = http.createServer()
  const httpsProxy = https.createServer({})

  httpProxy.on('request', requestHandler)
  httpsProxy.on('request', requestHandler)
  httpProxy.on('connect', connect)
  httpsProxy.on('connect', connect)

  function requestHandler (request, response) {
    const defaultRequestOptions = Object.assign({
      headers: request.headers,
      method: request.method,
      httpVersion: request.httpVersion
    }, urlParser(request.url))

    const id = nextId(request.url)
    debug('New request id...', id)

    const requestOptions = createRequestOptions(defaultRequestOptions)
    if (!requestOptions.hostname) {
      const hostAndPort = requestOptions.headers['host'].split(':')

      requestOptions.hostname = requestOptions.hostname || hostAndPort[0]
      requestOptions.host = requestOptions.host || requestOptions.hostname

      if (hostAndPort.length > 1) requestOptions.port = hostAndPort[1]
    }
    requestOptions.protocol = requestOptions.protocol || 'https:'

    debug('request options', requestOptions)
    const proxyRequest = requestOptions.protocol === 'https:' ? https.request(requestOptions) : http.request(requestOptions)

    proxyRequest.on('response', (proxyResponse) => {
      const headers = createResponseHeaders(proxyResponse.headers)
      response.statusCode = proxyResponse.statusCode

      const responseData = []
      createResponsePipe(proxyResponse, requestData, headers)
        .on('data', (data) => responseData.push(data))
        .pipe(response)

      transformHeaders(headers).forEach(header => response.setHeader(header.key, header.value))

      response.on('finish', () => responseDone({ id, headers, statusCode: proxyResponse.statusCode, statusMessage: proxyResponse.statusMessage, httpVersion: proxyResponse.httpVersion, body: Buffer.concat(responseData) }))
    })

    const requestData = Object.assign({ id }, requestOptions)
    requestStart(requestData)

    createRequestPipe(request).pipe(proxyRequest)
  }

  function connect (req, cltSocket, head) {
    const srvUrl = urlParser(`https://${req.url}`)

    debug('connect', srvUrl)
    generateServerCertificate(ca, srvUrl.hostname, (cert, key) => {
      httpsProxy.addContext(srvUrl.hostname, { key, cert })

      const srvSocket = net.connect(httpsProxy.address().port, passTrough)

      function passTrough () {
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Halland-Proxy\r\n' +
              '\r\n')
        srvSocket.write(head)
        srvSocket.pipe(cltSocket)
        cltSocket.pipe(srvSocket)
      }
    })
  }

  return { httpProxy, httpsProxy }
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

const startProxy = ({ port = 0, ca, requestSetup = [], requestStart = noop, requestPipe = [], responseHeaders = [], responsePipe = [], responseDone = noop }, cb) => {
  const options = {
    ca,
    createRequestOptions: createRequestOptions(requestSetup),
    requestStart,
    createRequestPipe: createRequestPipe(requestPipe),
    createResponseHeaders: createResponseHeaders(responseHeaders),
    createResponsePipe: createResponsePipe(responsePipe),
    responseDone
  }

  const { httpProxy, httpsProxy } = createProxy(options)

  httpProxy.listen(port, () => {
    httpsProxy.listen(0, () => {
      if (cb) return cb(null, httpProxy)
    })
  })
}

export default startProxy
