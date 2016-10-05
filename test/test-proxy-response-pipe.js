const tap = require('tap')
const common = require('./common')
const through = require('through2')

const responsePipe = [
  (requestData, headers) => {
    return through(function (chunk, enc, cb) {
      this.push(chunk.toString() + ' response pipe')
      cb()
    })
  }
]

tap.test('modify respone body', (test) => {
  test.plan(1)

  common.setup({ responsePipe }, (err, { request, server }) => {
    if (err) test.fail()

    server.on('request', (req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('hello proxy')
    })

    request
        .get('http://127.0.0.1:' + server.address().port)
        .on('response', function (response) {
          response
            .on('data', (data) => {
              test.strictSame(data.toString(), 'hello proxy response pipe')
            })
            .on('end', () => {
              server.close()
            })
        })
  })
})
