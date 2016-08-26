const React = require('react')
const RequestList = require('../components/request-list')

module.exports = ({requests}) => <div className='requests-container'>
                                   <a>Requests container</a>
                                   <RequestList requests={requests} />
                                 </div>
