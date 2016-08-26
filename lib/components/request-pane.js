const React = require('react')

module.exports = ({request}) => <div className='request-pane'>
                                  {request.headers.host}
                                  {request.url}
                                </div>
