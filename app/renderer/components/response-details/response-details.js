const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const ResponseTabs = require('./response-details-tabs')

/* eslint-disable react/jsx-indent */
module.exports = ({ response = {}, request = {} }) => {
  return <div>
          <Card>
            <CardHeader title='Request' />
            <CardText>
              <ResponseTabs response={request} />
            </CardText>
          </Card>
          <Card>
            <CardHeader title='Response' />
            <CardText>
              <ResponseTabs response={response} />
            </CardText>
          </Card>
         </div>
}
/* eslint-enable react/jsx-indent */
