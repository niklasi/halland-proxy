const React = require('react')
const { connect } = require('react-redux')
const { getRequestDetails } = require('../../actions')
const Highlight = require('react-highlight')
const zlib = require('zlib')

const decompressor = (response) => {
  if (!response.headers) return null
  const body = Buffer.from(response.body.data)
  switch (response.headers['content-encoding']) {
    case 'gzip':
      return zlib.gunzipSync(body).toString()
    case 'deflate':
      return zlib.deflateSync(body).toString()
    default:
      return body.toString()
  }
}

class RequestDetailsContainer extends React.Component {

  componentDidMount () {
    this.props.getRequestDetails(this.props.params.id)
  }

  render () {
    return <Highlight>{decompressor(this.props.response)}</Highlight>
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
