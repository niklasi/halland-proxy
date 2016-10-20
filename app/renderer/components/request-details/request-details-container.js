const React = require('react')
const { connect } = require('react-redux')
const { getRequestDetails } = require('../../actions')
const RequestDetails = require('./request-details')

class RequestDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getRequestDetails(this.props.params.id)
  }

  render () {
    return <RequestDetails response={this.props.response} />
  }
}

RequestDetailsContainer.propTypes = {
  response: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return { response: state.requestDetails, params: ownProps.params }
}

module.exports = connect(mapStateToProps, { getRequestDetails })(RequestDetailsContainer)
