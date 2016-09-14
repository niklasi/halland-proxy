const React = require('react')
const { connect } = require('react-redux')
const RequestsContainer = require('./requests')
const SidebarContainer = require('./sidebar')
const AppBar = require('material-ui/AppBar').default

const App = ({requests}) => <div className='app-container'>
                              <SidebarContainer />
                              <main className='main-container'>
                                <AppBar title='Proxy' />
                                <RequestsContainer requests={requests} />
                              </main>
                            </div>

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  const {requests} = state
  return {requests}
}

module.exports = connect(mapStateToProps)(App)
