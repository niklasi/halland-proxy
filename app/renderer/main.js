const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./containers/app')
const configureStore = require('./store/configureStore')
const createProxy = require('../lib/proxy')
const injectTapEventPlugin = require('react-tap-event-plugin')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme').default
const getMuiTheme = require('material-ui/styles/getMuiTheme').default
const through = require('through2')
const { addRequest, addResponse } = require('./actions')
const openDb = require('./db')
const config = require('./config').load()
const loadPlugins = require('./plugins')

injectTapEventPlugin()

require('./components/title')()

const db = openDb({path: config.db.path, backingStore: config.db.backingStore})
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

const theme = getMuiTheme(darkBaseTheme)
console.log(theme)
theme.toolbar.backgroundColor = theme.palette.canvasColor
theme.svgIcon.color = theme.palette.primary3Color

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>, document.getElementById('mount')
)
