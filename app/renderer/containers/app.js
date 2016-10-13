const React = require('react')
const RequestsContainer = require('./requests')
const SidebarContainer = require('./sidebar')
const AppBar = require('material-ui/AppBar').default
const IconButton = require('material-ui/IconButton').default
const SearchIcon = require('material-ui/svg-icons/action/search').default

const titleStyle = {
  textAlign: 'center',
  WebkitAppRegion: 'drag',
  fontSize: '14px'
}

const buttonStyle = {
  padding: '0px',
  height: '32px',
  width: '32px'
}

const appBarIconStyle = {
  marginTop: '0px'
}

/* eslint-disable react/jsx-indent */
const App = ({ requests }) => <div className='app-container'>
                              <SidebarContainer />
                              <header>
                                  <AppBar showMenuIconButton={false}
                                    titleStyle={titleStyle}
                                    title='Requests'
                                    iconElementRight={
                                    <IconButton style={buttonStyle}>
                                      <SearchIcon />
                                    </IconButton>
                                  }
                                    iconStyleRight={appBarIconStyle} />
                              </header>
                              <main>
                                  <RequestsContainer />
                              </main>
                            </div>
module.exports = App
