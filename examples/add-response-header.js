module.exports = function addResponseHeader (request, response) {
  return {
    onResponse: function (proxyResponse, next) {
      proxyResponse.headers['x-proxy-agent'] = 'Halland-Proxy'
      next()
    }
  }
}
