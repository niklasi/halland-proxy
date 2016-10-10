const React = require('react')
const { connect } = require('react-redux')
const RequestsContainer = require('./requests')
const SidebarContainer = require('./sidebar')
const AppBar = require('material-ui/AppBar').default

const titleStyle = {
  textAlign: 'center',
  height: '40px',
  lineHeight: '40px'
}
/* eslint-disable react/jsx-indent */
const App = ({ requests }) => <div className='app-container'>
                              <SidebarContainer />
                              <main className='main-container'>
                                <AppBar showMenuIconButton={false} titleStyle={titleStyle} title='Requests' />
                                <RequestsContainer requests={requests} />
                              </main>
                            </div>

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}

const mapStateToProps = ({ requests }) => ({ requests })

module.exports = connect(mapStateToProps)(App)
/* eslint-enable react/jsx-indent */
