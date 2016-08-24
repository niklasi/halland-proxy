const React = require('react')
const { render } = require('react-dom')
const App = require('./containers/app')
require('./components/title')()

render(<App />, document.getElementById('mount'))
