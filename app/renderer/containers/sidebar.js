const React = require('react')
const { List, ListItem } = require('material-ui/List')
const SettingsIcon = require('material-ui/svg-icons/action/settings').default

const iconStyle = {
  fill: '#FFF'
}
/* eslint-disable react/jsx-indent */
module.exports = () => <nav className='sidebar-container'>
                        <List>
                          <ListItem primaryText='&nbsp;' leftIcon={<SettingsIcon style={iconStyle} />} />
                        </List>
                      </nav>
/* eslint-enable react/jsx-indent */
