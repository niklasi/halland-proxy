const { parse } = require('url')

module.exports = function addQueryStringPlugin () {
  return {
    requestSetup: [
      function (options) {
        const query = 'abc=123'
        const url = parse(options.path)
        if (!url.query) {
          options.path += `?${query}`
        } else {
          options.path += `&${query}`
        }
        return options
      }
    ]
  }
}
