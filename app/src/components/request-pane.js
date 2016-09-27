const React = require('react')
const {Card, CardActions, CardHeader, CardText} = require('material-ui/Card')
const FlatButton = require('material-ui/FlatButton').default

/* eslint-disable react/jsx-indent */
module.exports = ({ request, response = { headers: [] } }) => {
  const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

  return <Card>
           <CardHeader
             title={request.url}
             subtitle={request.method}
             actAsExpander
             showExpandableButton />
           <CardActions>
             <FlatButton label='Details' />
             <FlatButton label='Action2' />
           </CardActions>
           <CardText expandable>
              <h4>Request</h4>
              <ul>
                {request.headers.map(headerMapper)}
              </ul>
              <h4>Response</h4>
              <ul>
                {response.headers.map(headerMapper)}
              </ul>
           </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
