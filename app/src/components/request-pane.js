const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const {Tabs, Tab} = require('material-ui/Tabs')

/* eslint-disable react/jsx-indent */
module.exports = ({ request, response = { headers: [] } }) => {
  const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

  console.log('response', response)
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
                  {request.headers.map(headerMapper)}
                </ul>
              </Tab>
              <Tab label='Response'>
                <ul>
                  {response.headers.map(headerMapper)}
                </ul>
                {request.url}
              </Tab>
            </Tabs>
           </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
