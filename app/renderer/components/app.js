const React = require('react')
const Sidebar = require('./sidebar')
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
const App = ({ children }) => {
  return <div className='app-container'>
                              <Sidebar />
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
                                {children}
                              </main>
                            </div>
}

module.exports = App
