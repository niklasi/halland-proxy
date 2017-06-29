import React from 'react'
import { connect } from 'react-redux'
import IconButton from 'material-ui/IconButton'
import CodeIcon from 'material-ui/svg-icons/action/code'
import ReplayIcon from 'material-ui/svg-icons/av/replay'
import { Link } from 'react-router'
import { replayRequest } from '../../actions'

/* eslint-disable react/jsx-indent */
class RequestPaneToolbar extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return <div>
        <IconButton onTouchTap={() => this.props.replayRequest(this.props.requestId)}><ReplayIcon /></IconButton>
        <Link to={`/requests/${this.props.requestId}`}><IconButton><CodeIcon /></IconButton></Link>
      </div>
  }
}
/* eslint-enable react/jsx-indent */
export default connect(() => { return {} }, { replayRequest })(RequestPaneToolbar)
