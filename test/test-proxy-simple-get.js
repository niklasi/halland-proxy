const tap = require('tap')
const common = require('./common')

tap.test('proxy simple http GET requests', (test) => {
  test.plan(3)

  common.setup((err, { request, server }) => {
    if (err) test.fail()

    server.on('request', (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('hello proxy')
    })

    request
        .get('http://127.0.0.1:' + server.address().port)
        .on('response', function (response) {
          test.strictSame(200, response.statusCode)
          test.strictSame(response.headers['content-type'], 'text/plain')
          response
            .on('data', (data) => {
              test.strictSame(data.toString(), 'hello proxy')
            })
            .on('end', () => {
              server.close()
            })
        })
  })
})

