const React = require('react')
const { render } = require('react-dom')
const { Provider } = require('react-redux')
const App = require('./components/app')
const configureStore = require('./store/configureStore')
const injectTapEventPlugin = require('react-tap-event-plugin')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme').default
const getMuiTheme = require('material-ui/styles/getMuiTheme').default
const { addRequest, addResponse } = require('./actions')
const perf = require('react-addons-perf')
const ipc = require('electron').ipcRenderer
const { Router, IndexRoute, Route, createMemoryHistory } = require('react-router')
const RequestsContainer = require('./components/requests')
const RequestDetailsContainer = require('./components/response-details')

injectTapEventPlugin()

require('./components/title')()

ipc.on('add-request', (e, request) => {
  store.dispatch(addRequest(request))
})

ipc.on('add-response', (e, response) => {
  store.dispatch(addResponse(response))
})

Object.defineProperty(window, 'perf', { get: () => perf })
const store = configureStore()

const theme = getMuiTheme(darkBaseTheme)
console.log(theme)
theme.appBar.height = 32
theme.toolbar.backgroundColor = theme.palette.canvasColor
theme.svgIcon.color = theme.palette.primary3Color

const history = createMemoryHistory('/requests')
render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={theme}>
      <Router history={history}>
        <Route path='/' component={App}>
          <Route path='requests'>
            <IndexRoute component={RequestsContainer} label='Requests' />
            <Route path=':id' component={RequestDetailsContainer} label='Details' />
          </Route>
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>, document.getElementById('mount')
)
