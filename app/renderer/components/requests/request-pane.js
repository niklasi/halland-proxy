const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const Avatar = require('material-ui/Avatar').default
const {Toolbar, ToolbarGroup} = require('material-ui/Toolbar')
const Headers = require('./headers')
const RequestPaneToolbar = require('./request-pane-toolbar')

/* eslint-disable react/jsx-indent */
module.exports = ({ request, response = { headers: [] } }) => {
  return <Card >
          <Toolbar>
            <ToolbarGroup firstChild>
              <CardHeader
                avatar={<Avatar>{response.statusCode}</Avatar>}
                title={request.host}
                subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
              />
            </ToolbarGroup>
            <RequestPaneToolbar />
           </Toolbar>
           <CardText>
              <Headers title='Request headers' headers={request.headers} />
              <Headers title='Response headers' headers={response.headers} />
           </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
