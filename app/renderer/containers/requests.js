const React = require('react')
const RequestPane = require('../components/request-pane')
const { connect } = require('react-redux')

const RequestContainer = ({ requests }) => {
  const mapper = (req, index) => <RequestPane key={index} request={req.request} response={req.response} />

  return <div className='requests-container'>{requests.map(mapper)}</div>
}

RequestContainer.propTypes = {
  requests: React.PropTypes.array.isRequired
}

const mapStateToProps = ({ requests, responses }) => ({ requests, responses })

module.exports = connect(mapStateToProps)(RequestContainer)
