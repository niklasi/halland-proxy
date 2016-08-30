const React = require('react')
const RequestPane = require('../components/request-pane')

module.exports = ({requests}) => {
  const mapper = (req, index) => <RequestPane key={index} request={req.request} response={req.response} />

  return <div className='requests-container'>
           {requests.map(mapper)}
         </div>
}
