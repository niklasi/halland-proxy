const React = require('react')
const { withRouter } = require('react-router')
const Sidebar = require('./sidebar')
const AppBar = require('material-ui/AppBar').default
const IconButton = require('material-ui/IconButton').default
const SearchIcon = require('material-ui/svg-icons/action/search').default
const BackIcon = require('material-ui/svg-icons/navigation/chevron-left').default

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

const appBarIconStyleLeft = (path) => ({
  visibility: path ? 'visible' : 'hidden',
  margin: '0px 0px 0px 53px'
})

const appBarIconStyle = {
  marginTop: '0px'
}

/* eslint-disable react/jsx-indent */
const App = (props) => {
  const currentRoute = props.routes[props.routes.length - 1]

  return <div className='app-container'>
                              <Sidebar />
                              <header>
                                  <AppBar showMenuIconButton
                                    titleStyle={titleStyle}
                                    title={currentRoute.label}
                                    iconElementLeft={
                                      <IconButton onClick={props.router.goBack} style={buttonStyle}>
                                        <BackIcon />
                                      </IconButton>
                                    }
                                    iconStyleLeft={appBarIconStyleLeft(currentRoute.path)}
                                    iconElementRight={
                                    <IconButton style={buttonStyle}>
                                      <SearchIcon />
                                    </IconButton>
                                  }
                                    iconStyleRight={appBarIconStyle} />
                              </header>
                              <main>
                                {props.children}
                              </main>
                            </div>
}

module.exports = withRouter(App)
