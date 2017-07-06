import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/app'
import configureStore from './store/configureStore'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { addRequest, addResponse, toggleFilterInput } from './actions'
import perf from 'react-addons-perf'
import { ipcRenderer as ipc } from 'electron'
import { Router, IndexRoute, Route, createMemoryHistory } from 'react-router'
import RequestsContainer from './components/requests'
import HttpMessageDetailsContainer from './components/http-message-details'
import { ADD_REQUEST, ADD_RESPONSE, TOGGLE_FILTER_INPUT } from '../constants/ipcMessages'

injectTapEventPlugin()

ipc.on(ADD_REQUEST, (e, request) => {
  store.dispatch(addRequest(request))
})

ipc.on(ADD_RESPONSE, (e, response) => {
  store.dispatch(addResponse(response))
})

ipc.on(TOGGLE_FILTER_INPUT, (e) => {
  store.dispatch(toggleFilterInput())
})

Object.defineProperty(window, 'perf', { get: () => perf })
const store = configureStore()

const theme = getMuiTheme(darkBaseTheme)
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
            <Route path=':id' component={HttpMessageDetailsContainer} label='Details' />
          </Route>
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>, document.getElementById('mount')
)
