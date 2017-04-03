import tap from 'tap'
import common from './common'

const plugin = function (req, res) {
  return {
    requestSetup: (requestOption, next) => {
      requestOption.path += '?mode=test'
      return next()
    }
  }
}

tap.test('setup request', (test) => {
  test.plan(1)

  common.setup({ plugins: [plugin] }, (err, { request, server }) => {
    if (err) test.fail()

    server.on('request', (req, res) => {
      test.match(req.url, /\?mode=test/)

      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('hello proxy')
    })

    request
      .get('http://127.0.0.1:' + server.address().port)
      .on('response', function (response) {
        server.close()
      })
  })
})
