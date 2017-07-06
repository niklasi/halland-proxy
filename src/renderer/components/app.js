import React from 'react'
import { withRouter } from 'react-router'
import Sidebar from './sidebar'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui/svg-icons/action/search'
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left'
import { connect } from 'react-redux'
import { toggleFilterInput } from '../actions'

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
                                    <IconButton onClick={props.toggleFilterInput} style={buttonStyle}>
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

export default connect((state) => state, { toggleFilterInput })(withRouter(App))
