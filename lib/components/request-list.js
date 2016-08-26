const React = require('react')

module.exports = ({requests}) => {
  const requestItem = (req, index) => <li key={index}>
                                        {req.headers.host}
                                        {req.url}
                                      </li>

  return <div>
           <ul>
             {requests.map(requestItem)}
           </ul>
         </div>
}
