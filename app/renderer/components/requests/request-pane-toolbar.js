import React from 'react'
import { ToolbarGroup } from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import CodeIcon from 'material-ui/svg-icons/action/code'
import ReplayIcon from 'material-ui/svg-icons/av/replay'
import { Link } from 'react-router'

/* eslint-disable react/jsx-indent */
class RequestPaneToolbar extends React.Component {

  shouldComponentUpdate () {
    return false
  }

  render () {
    return <ToolbarGroup lastChild>
        <IconButton><ReplayIcon /></IconButton>
        <Link to={`/requests/${this.props.requestId}`}><IconButton><CodeIcon /></IconButton></Link>
      </ToolbarGroup>
  }
}
/* eslint-enable react/jsx-indent */
export default RequestPaneToolbar
