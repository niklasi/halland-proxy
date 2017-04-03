import http from 'http'
import https from 'https'
import { parse as urlParser } from 'url'
import net from 'net'
import { generateServerCertificate } from '../ca'
import through from 'through2'
import debugFactory from 'debug'

const debug = debugFactory('halland-proxy:proxy')

const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

const createProxy = ({ ca, plugins, requestStart, responseDone }) => {
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

    const requestOptions = defaultRequestOptions
    if (!requestOptions.hostname) {
      const hostAndPort = requestOptions.headers['host'].split(':')

      requestOptions.hostname = requestOptions.hostname || hostAndPort[0]
      requestOptions.host = requestOptions.host || requestOptions.hostname

      if (hostAndPort.length > 1) requestOptions.port = hostAndPort[1]
    }
    requestOptions.protocol = requestOptions.protocol || 'https:'

    let proxyRequest = null
    let requestData = null

    let requestSetup = []
    let onRequest = []
    let requestPipe = []
    let onResponse = []
    let responsePipe = []

    plugins
      .map(p => p(request, response))
      .forEach(p => {
        if (p.requestSetup) requestSetup.push((next) => p.requestSetup(requestOptions, next))
        if (p.onRequest) onRequest.push((next) => p.onRequest(proxyRequest, next))
        if (p.requestPipe) requestPipe.push(() => p.requestPipe(proxyRequest))
        if (p.onResponse) onResponse.push(p.onResponse)
        if (p.responsePipe) responsePipe.push(p.responsePipe)
      })

    let handlers = [...requestSetup]
    handlers.push(createProxyRequest)
    handlers.push(handleRequest)
    handlers = [...handlers, ...onRequest]
    handlers.push(startRequest)

    let index = -1
    function next () {
      index++
      if (index >= handlers.length) return

      const fn = handlers[index]

      return fn(next)
    }

    const requestBody = []
    next()

    function createProxyRequest (next) {
      proxyRequest = requestOptions.protocol === 'https:' ? https.request(requestOptions) : http.request(requestOptions)
      const _write = proxyRequest.write.bind(proxyRequest)
      proxyRequest.write = function (chunk, enc, cb) {
        requestBody.push(Buffer.from(chunk))
        _write(chunk, enc, cb)
      }
      next()
    }

    function startRequest (next) {
      debug('Create request pipe...')
      proxyRequest.on('finish', function () {
        debug('request options', requestOptions)
        requestData = Object.assign({ id }, requestOptions, { body: Buffer.concat(requestBody) })
        requestStart(requestData)
      })

      requestPipe.reduce((r, p) => {
        return r.pipe(p(proxyRequest) || noopStream())
      }, request)
      .pipe(proxyRequest)

      next()
    }

    function handleRequest (next) {
      proxyRequest.on('response', onProxyResponse)
      next()
    }

    function onProxyResponse (proxyResponse) {
      let responseIndex = -1
      function responseNext () {
        responseIndex++
        if (responseIndex >= onResponse.length) return

        const fn = onResponse[responseIndex]

        return fn(proxyResponse, responseNext)
      }

      responseNext()

      const responseData = []
      responsePipe.reduce((r, p) => {
        return r.pipe(p(proxyResponse) || noopStream())
      }, proxyResponse)
      .on('data', (data) => {
        responseData.push(data)
      })
      .pipe(response)

      const headers = proxyResponse.headers
      transformHeaders(headers).forEach(header => response.setHeader(header.key, header.value))

      response.on('finish', () => {
        responseDone({
          id,
          headers,
          statusCode: proxyResponse.statusCode,
          statusMessage: proxyResponse.statusMessage,
          httpVersion: proxyResponse.httpVersion,
          body: Buffer.concat(responseData) })
      })
    }
  }

  function connect (req, cltSocket, head) {
    const srvUrl = urlParser(`https://${req.url}`)

    debug('connect', srvUrl)
    let srvSocket = null
    if (ca) {
      generateServerCertificate(ca, srvUrl.hostname, (cert, key) => {
        httpsProxy.addContext(srvUrl.hostname, { key, cert })
        srvSocket = net.connect(httpsProxy.address().port, passTrough)
      })
    } else {
      srvSocket = net.connect(srvUrl.port, srvUrl.hostname, passTrough)
    }

    function passTrough () {
      cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
          'Proxy-agent: Halland-Proxy\r\n' +
            '\r\n')
      srvSocket.write(head)
      srvSocket.pipe(cltSocket)
      cltSocket.pipe(srvSocket)
    }
  }

  return { httpProxy, httpsProxy }
}

const noopStream = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

const noop = () => {}

const startProxy = ({ port = 0, ca, plugins = [], requestStart = noop, responseDone = noop }, cb) => {
  const options = {
    ca,
    plugins,
    requestStart,
    responseDone
  }
  const { httpProxy, httpsProxy } = createProxy(options)

  httpProxy.on('close', httpsProxy.close.bind(httpsProxy))

  httpProxy.listen(port, () => {
    httpsProxy.listen(0, () => {
      if (cb) return cb(null, httpProxy)
    })
  })
}

export default startProxy
