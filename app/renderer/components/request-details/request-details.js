const React = require('react')
const Highlight = require('react-highlight')
const zlib = require('zlib')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const Headers = require('../requests/headers')

const decompressor = (response) => {
  if (!response.headers) return null
  const body = Buffer.from(response.body.data)
  switch (response.headers['content-encoding']) {
    case 'gzip':
      return zlib.gunzipSync(body).toString()
    case 'deflate':
      return zlib.deflateSync(body).toString()
    default:
      return body.toString()
  }
}

const Code = ({ response }) => <Highlight>{decompressor(response)}</Highlight>

const { Tabs, Tab } = require('material-ui/Tabs')
const tabStyle = {
  color: '#FFF'
}

/* eslint-disable react/jsx-indent */
module.exports = (props) => {
  const tabCount = 5
  const width = `${tabCount * 10}%`
  return <Card>
          <CardHeader title='Response' />
          <CardText>
            <Tabs tabItemContainerStyle={{backgroundColor: 'transparent', width}}>
              <Tab style={tabStyle} label='Headers' value={0}>
                {
                  props.response.headers ? <Headers title='Response headers' headers={props.response.headers} /> : null
                }
              </Tab>
              <Tab style={tabStyle} label='Text'>
                <Code {...props} />
              </Tab>
              <Tab style={tabStyle} label='Compressed'>
                <Code {...props} />
              </Tab>
              <Tab style={tabStyle} label='Html'>
                <Code {...props} />
              </Tab>
              <Tab style={tabStyle} label='Raw'>
                <Code {...props} />
              </Tab>
            </Tabs>
          </CardText>
         </Card>
}
/* eslint-enable react/jsx-indent */
