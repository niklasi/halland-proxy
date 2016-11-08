const React = require('react')
const { connect } = require('react-redux')
const { getRequestDetails } = require('../../actions')
const ResponseDetails = require('./response-details')

class ResponseDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getRequestDetails(this.props.params.id)
  }

  render () {
    return <ResponseDetails request={this.props.request} response={this.props.response} />
  }
}

ResponseDetailsContainer.propTypes = {
  request: React.PropTypes.object,
  response: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    request: state.requestDetails.request,
    response: state.requestDetails.response
  }
}

module.exports = connect(mapStateToProps, { getRequestDetails })(ResponseDetailsContainer)
