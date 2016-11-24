import React from 'react'
import { connect } from 'react-redux'
import { getHttpMessageDetails } from '../../actions'
import MessageDetails from './http-message-details'

class HttpMessageDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getHttpMessageDetails(this.props.params.id)
  }

  render () {
    return <MessageDetails request={this.props.request} response={this.props.response} />
  }
}

HttpMessageDetailsContainer.propTypes = {
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

export default connect(mapStateToProps, { getHttpMessageDetails })(HttpMessageDetailsContainer)
