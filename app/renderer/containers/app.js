const React = require('react')
const { connect } = require('react-redux')
const RequestsContainer = require('./requests')
const SidebarContainer = require('./sidebar')
const AppBar = require('material-ui/AppBar').default
const IconButton = require('material-ui/IconButton').default
const SearchIcon = require('material-ui/svg-icons/action/search').default

const titleStyle = {
  textAlign: 'center'
}
/* eslint-disable react/jsx-indent */
const App = ({ requests }) => <div className='app-container'>
                              <SidebarContainer />
                              <main className='main-container'>
                                <AppBar showMenuIconButton={false}
                                  titleStyle={titleStyle}
                                  title='Requests'
                                  iconElementRight={<IconButton><SearchIcon /></IconButton>}
                                  />
                                <RequestsContainer requests={requests} />
                              </main>
                            </div>

App.propTypes = {
  requests: React.PropTypes.array.isRequired
}

const mapStateToProps = ({ requests }) => ({ requests })

module.exports = connect(mapStateToProps)(App)
/* eslint-enable react/jsx-indent */
