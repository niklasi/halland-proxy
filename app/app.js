// const domready = require('domready')
// const startProxy = require('./proxy')

// domready(() => {

//   const proxy = startProxy()

//   proxy.listen({port: 8888}, (err) => {
//     console.log('Server started...')

//     const q = document.querySelector.bind(document)
//     const requestList = q('#mount')

//     proxy.onRequest((ctx, cb) => {
//       const req = ctx.clientToProxyRequest
//       const li = document.createElement('li')
//       li.appendChild(document.createTextNode(req.url))
//       console.dir(req.headers)

//       requestList.appendChild(li)
//       // ctx.onResponseData(function(ctx, chunk, callback) {
//       //   chunk = new Buffer(chunk.toString().replace(/<h3.*?<\/h3>/g, '<h3>Pwned!</h3>'))
//       //   return callback(null, chunk)
//       // })

//       return cb()
//     })

//     proxy.onError((err) => {
//       console.log(err)
//     })
//   })
// })
