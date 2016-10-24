const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const responseTabs = require('./request-details-tab')
const { Tabs } = require('material-ui/Tabs')

const tabItemContainerStyle = {
  backgroundColor: 'transparent'
}

// const tabStyle = {
//   color: '#FFF'
// }

const contentContainerStyle = {
  minHeight: '200px'
}

/* eslint-disable react/jsx-indent */
module.exports = (props) => {
  const tabs = responseTabs(props.response)
  return <Card>
          <CardHeader title='Response' />
          <CardText>
            <Tabs contentContainerStyle={contentContainerStyle} tabItemContainerStyle={tabItemContainerStyle}>
              { tabs.map(tab => tab) }
            </Tabs>
          </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
