const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./out/containers/app')
const configureStore = require('./out/store/configureStore')
const createProxy = require('./out/proxy')
const injectTapEventPlugin = require('react-tap-event-plugin')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const through = require('through2')
const { addRequest, addResponse } = require('./out/actions')
const openDb = require('./out/db')
const config = require('./out/config')()
const loadPlugins = require('./out/plugins')

injectTapEventPlugin()

require('./out/components/title')()

const db = openDb({path: config.db.path, backingStore: config.db.backingStore})
window.__defineGetter__('db', () => db)
const store = configureStore()
const plugins = loadPlugins(config)

const options = {
  port: config.port,
  requestSetup: plugins.requestSetup,
  requestStart: (request) => {
    db.put(`${request.id}!request!meta`, request)
    store.dispatch(addRequest(request))
  },
  requestPipe: plugins.requestPipe,
  responseHeaders: plugins.responseHeaders,
  responsePipe: [
    (request, responseHeaders) => {
      let chunkIndex = 0
      return through(function (chunk, enc, cb) {
        db.put(`${request.id}!response!body!${chunkIndex}`, chunk)
        chunkIndex += 1
        this.push(chunk)
        cb()
      })
    }].concat(plugins.responsePipe),
  responseDone: (response) => {
    db.put(`${response.id}!response!meta`, response)
    store.dispatch(addResponse(response))
  }
}

createProxy(options, (err) => {
  if (err) throw err
  console.log(`Renderer Server started on port ${options.port}...`)
})

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>, document.getElementById('mount')
)
