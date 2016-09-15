const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./out/containers/app')
const configureStore = require('./out/store/configureStore')
const createProxy = require('./out/proxy')
const injectTapEventPlugin = require('react-tap-event-plugin')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const levelup = require('levelup')

const db = levelup('/tmp/halland-db', {db: require('memdown')})
injectTapEventPlugin()

require('./out/components/title')()

window.__defineGetter__('db', () => db)
const store = configureStore()

//   const req = ctx.clientToProxyRequest
//   const resp = ctx.proxyToClientResponse

//   ctx.onResponseData((c, chunk, cb) => {
//     console.log(chunk.toString())
//     return cb(null, chunk)
//   })

//   store.dispatch(addRequest(req, resp))
//   cb()
// })

//
//   const req = ctx.clientToProxyRequest
//   console.log('request', ctx)
//   // store.dispatch(addRequest(req))
//   cb()
// })

// proxy.onResponseEnd((ctx, cb) => {
//   const resp = ctx.clientToProxyResponse
//   console.log('Response', resp.headersSent)
//   store.dispatch(addResponse(resp))
//   cb()
// })

const port = 8888
createProxy({port}).listen((err) => {
  if (err) throw err
  console.log(`Renderer Server started on port ${port}...`)
})

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>, document.getElementById('mount')
)
