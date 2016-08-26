const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./containers/app')
const configureStore = require('./store/configureStore')
const {addRequest} = require('./actions')
const proxy = require('./proxy')()

require('./components/title')()

const store = configureStore()

proxy.onRequest((ctx, cb) => {
  const req = ctx.clientToProxyRequest
  store.dispatch(addRequest(req))
  cb()
})

const port = 8888
proxy.listen({port}, (err) => {
  if (err) throw err
  console.log(`Renderer Server started on port ${port}...`)
})

render(<Provider store={store}>
         <App />
       </Provider>, document.getElementById('mount'))
