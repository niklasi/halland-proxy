const { parse } = require('url')

module.exports = function addQueryStringPlugin (request, response) {
  return {
    requestSetup: function (requestOptions, next) {
      const query = 'abc=123'
      const url = parse(requestOptions.path)
      if (!url.query) {
        requestOptions.path += `?${query}`
      } else {
        requestOptions.path += `&${query}`
      }

      next()
    }
  }
}
