import React from 'react'
import Headers from '../requests/headers'
import Highlight from 'react-highlight'
import hexer from 'hexer'
import { Tabs, Tab } from 'material-ui/Tabs'
import decompressor from './decompressor'

const isText = (response) => {
  const contentType = (response.headers ? response.headers['content-type'] : '') || ''

  return contentType.split('/')[0] === 'text' || contentType.split(';')[0] === 'application/json'
}

const isImage = (response) => {
  const contentType = (response.headers ? response.headers['content-type'] : '') || ''

  return contentType.split('/')[0] === 'image'
}

const isHtml = (response) => {
  const contentType = (response.headers ? response.headers['content-type'] : '') || ''

  return contentType.split(';')[0] === 'text/html'
}

const isJson = (response) => {
  const contentType = (response.headers ? response.headers['content-type'] : '') || ''

  return contentType.split(';')[0] === 'application/json'
}

const tabItemContainerStyle = {
  backgroundColor: 'transparent'
}

const contentContainerStyle = {
  minHeight: '200px'
}

const tabStyle = {
  color: '#FFF'
}

/* eslint-disable react/jsx-indent */
const ResponseDetailsTabs = ({ compressedBody, body, response }) => {
  return <Tabs contentContainerStyle={contentContainerStyle} tabItemContainerStyle={tabItemContainerStyle}>
    <Tab key='tab-response-headers' style={tabStyle} label='Headers'>
      {response.headers ? <Headers title='Response headers' headers={response.headers} /> : null}
    </Tab>
    {
      isText(response)
        ? <Tab key='tab-response-text' style={tabStyle} label='Text'>
            <Highlight className='text'>{body.toString()}</Highlight>
          </Tab>
        : null
    }
    <Tab key='tab-response-hex' style={tabStyle} label='Hex'>
      {response.body ? <Highlight className='no-highlight'>{hexer(Buffer.from(body), {group: 1})}</Highlight> : null}
    </Tab>
    {
      compressedBody.length > 0
      ? <Tab key='tab-response-compressed' style={tabStyle} label='Compressed'>
          {response.body ? <Highlight className='no-highlight'>{hexer(compressedBody, {group: 1})}</Highlight> : null}
        </Tab>
      : null
    }
    {
      isHtml(response)
      ? <Tab key='tab-response-html' style={tabStyle} label='Html'>
          <Highlight className='html'>{body.toString()}</Highlight>
        </Tab>
      : null
    }
    {
      isJson(response)
      ? <Tab key='tab-response-json' style={tabStyle} label='Json'>
          <Highlight className='json'>{JSON.stringify(JSON.parse(body.toString()), null, ' ')}</Highlight>
        </Tab>
      : null
    }
    {
      isImage(response)
      ? <Tab key='tab-response-image' style={tabStyle} label='Image'>
          <span><img src={`data:${response.headers['content-type'].split(';')[0]};base64,${Buffer.from(body).toString('base64')}`} /></span>
        </Tab>
      : null
    }
    {
      response.headers
      ? <Tab key='tab-response-raw' style={tabStyle} label='Raw'>
          <Highlight className='http'>{`HTTP/1.1 ${response.statusCode} ${response.statusMessage}\n${Object.keys(response.headers).map(h => `${h}: ${response.headers[h]}`).join('\n')}\n\n${body.toString(isText(response) ? 'utf-8' : 'binary')}`}</Highlight>
        </Tab>
      : null
    }
  </Tabs>
}

export default decompressor(ResponseDetailsTabs)
/* eslint-enable react/jsx-indent */
