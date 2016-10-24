const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const ResponseTabs = require('./request-details-tab')

/* eslint-disable react/jsx-indent */
module.exports = (props) => {
  return <Card>
          <CardHeader title='Response' />
          <CardText>
            <ResponseTabs response={props.response} />
          </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
