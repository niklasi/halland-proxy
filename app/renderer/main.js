import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/app'
import configureStore from './store/configureStore'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { addRequest, addResponse } from './actions'
import perf from 'react-addons-perf'
import { ipcRenderer } from 'electron'
import { Router, IndexRoute, Route, createMemoryHistory } from 'react-router'
import RequestsContainer from './components/requests'
import RequestDetailsContainer from './components/response-details'
import title from './components/title'

injectTapEventPlugin()

title()

ipcRenderer.on('add-request', (e, request) => {
  store.dispatch(addRequest(request))
})

ipcRenderer.on('add-response', (e, response) => {
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
