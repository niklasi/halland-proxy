const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const {Tabs, Tab} = require('material-ui/Tabs')
const Response = require('./response')

/* eslint-disable react/jsx-indent */
module.exports = ({ request, response = { headers: [] } }) => {
  const transformHeaders = (headers) => {
    return Object.keys(headers).map(header => {
      return {key: header, value: headers[header]}
    })
  }

  const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

  return <Card>
           <CardHeader
             title={request.url}
             subtitle={request.method}
             actAsExpander
             showExpandableButton />
           <CardText expandable>
            <Tabs>
              <Tab label='Request'>
                <ul>
                  {transformHeaders(request.headers).map(headerMapper)}
                </ul>
              </Tab>
              <Tab label='Response'>
                <ul>
                  {transformHeaders(response.headers).map(headerMapper)}
                </ul>
                <Response response={response} />
              </Tab>
            </Tabs>
           </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
