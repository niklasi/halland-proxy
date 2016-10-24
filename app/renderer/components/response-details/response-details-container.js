const React = require('react')
const { connect } = require('react-redux')
const { getRequestDetails } = require('../../actions')
const ResponseDetails = require('./response-details')

class ResponseDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getRequestDetails(this.props.params.id)
  }

  render () {
    return <ResponseDetails response={this.props.response} />
  }
}

ResponseDetailsContainer.propTypes = {
  response: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return { response: state.requestDetails, params: ownProps.params }
}

module.exports = connect(mapStateToProps, { getRequestDetails })(ResponseDetailsContainer)
