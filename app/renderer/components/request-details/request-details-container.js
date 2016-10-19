const React = require('react')
const { connect } = require('react-redux')
const { getRequestDetails } = require('../../actions')
const Highlight = require('react-highlight')

class RequestDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getRequestDetails(this.props.params.id)
  }

  render () {
    return <Highlight>{this.props.requestDetails.toString()}</Highlight>
  }
}

RequestDetailsContainer.propTypes = {
  requestDetails: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return { requestDetails: state.requestDetails, params: ownProps.params }
}

module.exports = connect(mapStateToProps, { getRequestDetails })(RequestDetailsContainer)
