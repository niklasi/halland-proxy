import React from 'react'
import { connect } from 'react-redux'
import { getRequestDetails } from '../../actions'
import ResponseDetails from './response-details'

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

export default connect(mapStateToProps, { getRequestDetails })(ResponseDetailsContainer)
