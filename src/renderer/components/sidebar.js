import React from 'react'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import config from '../../lib/config'

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
export default () => <Drawer containerStyle={drawerStyle} width={76}>
        <IconButton iconStyle={iconStyle} style={buttonStyle} onTouchTap={config.open}>
          <SettingsIcon />
        </IconButton>
    </Drawer>
/* eslint-enable react/jsx-indent */
