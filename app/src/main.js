const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./out/containers/app')
const configureStore = require('./out/store/configureStore')
const createProxy = require('./out/proxy')
const injectTapEventPlugin = require('react-tap-event-plugin')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const levelup = require('levelup')
const through = require('through2')
const { addRequest, addResponse } = require('./out/actions')
const bytewise = require('bytewise')

const db = levelup('/tmp/halland-db', {db: require('memdown'), keyEncoding: bytewise, valueEncoding: 'json'})
injectTapEventPlugin()

require('./out/components/title')()

window.__defineGetter__('db', () => db)
const store = configureStore()

const options = {
  port: 8888,
  requestStart: (request) => {
    db.put(`${request.id}!request!meta`, request)
    store.dispatch(addRequest(request))
  },
  requestPipe: [
    (request) => {
      let chunkIndex = 0
      return through(function (chunk, enc, cb) {
        db.put(`${request.id}!request!body!${chunkIndex}`, chunk)
        chunkIndex += 1
        this.push(chunk)
        cb()
      })
    }
  ],
  responsePipe: [
    (request) => {
      let chunkIndex = 0
      return through(function (chunk, enc, cb) {
        db.put(`${request.id}!response!body!${chunkIndex}`, chunk)
        chunkIndex += 1
        this.push(chunk)
        cb()
      })
    },
    (request) => {
      return through(function (chunk, enc, cb) {
        console.log('plugin 1')
        this.push(chunk)
        cb()
      })
    },
    (request) => {
      return through(function (chunk, enc, cb) {
        console.log('plugin 2')
        this.push(chunk)
        cb()
      })
    }
  ],
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
