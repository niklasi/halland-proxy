module.exports = function addResponseHeader () {
  return {
    responseHeaders: [
      (headers) => {
        headers['x-proxy-agent'] = 'Halland-Proxy'
        return headers
      }
    ]
  }
}
