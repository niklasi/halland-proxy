const React = require('react')
const SettingsIcon = require('material-ui/svg-icons/action/settings').default
const Drawer = require('material-ui/Drawer').default
const IconButton = require('material-ui/IconButton').default
const config = require('../config.js')

const drawerStyle = {
  overflow: 'none'
}
/* eslint-disable react/jsx-indent */
module.exports = () => <Drawer containerStyle={drawerStyle} width={60}>
      <IconButton onTouchTap={config.open} tooltipPosition='bottom-right' tooltip='Settings' style={{padding: '18px'}}>
        <SettingsIcon />
      </IconButton>
    </Drawer>
/* eslint-enable react/jsx-indent */
