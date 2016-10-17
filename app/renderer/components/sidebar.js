const React = require('react')
const SettingsIcon = require('material-ui/svg-icons/action/settings').default
const Drawer = require('material-ui/Drawer').default
const IconButton = require('material-ui/IconButton').default
const config = require('../../lib/config')

const drawerStyle = {
  overflow: 'none',
  padding: '30px 0px 0px 14px',
  WebkitAppRegion: 'drag'
}
const buttonStyle = {
  padding: '0px'
}

const iconStyle = {
  height: '32px',
  width: '32px'
}
/* eslint-disable react/jsx-indent */
module.exports = () => <Drawer containerStyle={drawerStyle} width={76}>
        <IconButton iconStyle={iconStyle} style={buttonStyle} onTouchTap={config.open}>
          <SettingsIcon />
        </IconButton>
    </Drawer>
/* eslint-enable react/jsx-indent */
