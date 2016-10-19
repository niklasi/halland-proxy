const React = require('react')
const { ToolbarGroup } = require('material-ui/Toolbar')
const IconButton = require('material-ui/IconButton').default
const CodeIcon = require('material-ui/svg-icons/action/code').default
const ReplayIcon = require('material-ui/svg-icons/av/replay').default
const { Link } = require('react-router')

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
module.exports = RequestPaneToolbar
