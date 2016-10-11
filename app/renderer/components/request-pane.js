const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const Avatar = require('material-ui/Avatar').default
const {Toolbar, ToolbarGroup} = require('material-ui/Toolbar')
const IconButton = require('material-ui/IconButton').default
const CodeIcon = require('material-ui/svg-icons/action/code').default
const ReplayIcon = require('material-ui/svg-icons/av/replay').default

/* eslint-disable react/jsx-indent */
module.exports = ({ request, response = { headers: [] } }) => {
  const transformHeaders = (headers) => {
    return Object.keys(headers).map(header => {
      return {key: header, value: headers[header]}
    })
  }

  const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

  return <Card >
          <Toolbar>
            <ToolbarGroup firstChild>
              <CardHeader
                style={{maxWidth: '300px'}}
                avatar={<Avatar>{response.statusCode}</Avatar>}
                title={request.host}
                subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
              />
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <IconButton tooltip='Replay request'><ReplayIcon /></IconButton>
              <IconButton tooltip='View'><CodeIcon /></IconButton>
            </ToolbarGroup>
           </Toolbar>
           <CardText style={{maxWidth: '300px'}}>
              <h3>Request headers</h3>
              <ul>
                {transformHeaders(request.headers).map(headerMapper)}
              </ul>
              <h3>Response headers</h3>
              <ul>
                {transformHeaders(response.headers).map(headerMapper)}
              </ul>
           </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
