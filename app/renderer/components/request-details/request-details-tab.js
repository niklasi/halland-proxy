const Headers = require('../requests/headers')
const Highlight = require('react-highlight')
const zlib = require('zlib')
const hexer = require('hexer')
const { Tab } = require('material-ui/Tabs')

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

const isCompressed = (response) => {
  if (!response.headers) return null

  switch (response.headers['content-encoding']) {
    case 'gzip':
      return true
    case 'deflate':
      return true
    default:
      return false
  }
}

const isText = (response) => {
  const contentType = response.headers ? response.headers['content-type'] : ''

  return contentType.split('/')[0] === 'text' || contentType.split(';')[0] === 'application/json'
}

const isHtml = (response) => {
  const contentType = response.headers ? response.headers['content-type'] : ''

  return contentType.split(';')[0] === 'text/html'
}

const isJson = (response) => {
  const contentType = response.headers ? response.headers['content-type'] : ''

  return contentType.split(';')[0] === 'application/json'
}

const tabStyle = {
  color: '#FFF'
}

module.exports = (response) => {
  const body = decompressor(response)

  const tabs = []

  tabs.push(
    <Tab key='tab-response-headers' style={tabStyle} label='Headers'>
      {response.headers ? <Headers title='Response headers' headers={response.headers} /> : null}
    </Tab>
  )

  if (isText(response)) {
    tabs.push(
      <Tab key='tab-response-text' style={tabStyle} label='Text'>
        <Highlight className='text'>{body}</Highlight>
      </Tab>
    )
  }

  tabs.push(
    <Tab key='tab-response-hex' style={tabStyle} label='Hex'>
      {response.body ? <Highlight className='no-highlight'>{hexer(Buffer.from(body))}</Highlight> : null}
    </Tab>
  )

  if (isCompressed(response)) {
    tabs.push(
      <Tab key='tab-response-compressed' style={tabStyle} label='Compressed'>
        {response.body ? <Highlight className='no-highlight'>{hexer(Buffer.from(response.body.data))}</Highlight> : null}
      </Tab>
    )
  }

  if (isHtml(response)) {
    tabs.push(
      <Tab key='tab-response-html' style={tabStyle} label='Html'>
        <Highlight className='html'>{body}</Highlight>
      </Tab>
    )
  }

  if (isJson(response)) {
    tabs.push(
      <Tab key='tab-response-json' style={tabStyle} label='Json'>
        <Highlight className='json'>{JSON.stringify(JSON.parse(body), null, ' ')}</Highlight>
      </Tab>
    )
  }

  return tabs
}
