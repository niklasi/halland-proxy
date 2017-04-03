import tap from 'tap'
import common from './common'

const plugin = function (req, res) {
  return {
    onResponse: (proxyResponse, next) => {
      proxyResponse.headers['x-test-header'] = 'test'
      return next()
    }
  }
}

tap.test('modify response headers', (test) => {
  test.plan(1)

  common.setup({ plugins: [plugin] }, (err, { request, server }) => {
    if (err) test.fail()

    server.on('request', (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('hello proxy')
    })

    request
      .get('http://127.0.0.1:' + server.address().port)
      .on('response', function (response) {
        test.strictSame(response.headers['x-test-header'], 'test')
        server.close()
      })
  })
})
