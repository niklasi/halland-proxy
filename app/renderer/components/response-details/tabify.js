import React from 'react'
import { Tab } from 'material-ui/Tabs'
import Headers from '../requests/headers'
import Highlight from 'react-highlight'
import hexer from 'hexer'

export default function tabify (WrappedComponent) {
  const tabStyle = {
    color: '#FFF'
  }

  function headersTab (headers) {
    if (!headers) return null
    return <Tab key='tab-response-headers' style={tabStyle} label='Headers'>
      <Headers title='Response headers' headers={headers} />
    </Tab>
  }

  function isText (contentType = '') {
    return contentType.split('/')[0] === 'text' || contentType.split(';')[0] === 'application/json'
  }

  function textTab (contentType = '', body) {
    if (!isText(contentType)) return null

    return <Tab key='tab-response-text' style={tabStyle} label='Text'>
      <Highlight className='text'>{body.toString()}</Highlight>
    </Tab>
  }

  function htmlTab (contentType = '', body) {
    const isHtml = contentType.split(';')[0] === 'text/html'
    if (!isHtml) return null

    return <Tab key='tab-response-html' style={tabStyle} label='Html'>
      <Highlight className='html'>{body.toString()}</Highlight>
    </Tab>
  }

  function jsonTab (contentType = '', body) {
    const isJson = contentType.split(';')[0] === 'application/json'
    if (!isJson) return null
    return <Tab key='tab-response-json' style={tabStyle} label='Json'>
      <Highlight className='json'>{JSON.stringify(JSON.parse(body.toString()), null, ' ')}</Highlight>
    </Tab>
  }

  function imageTab (contentType = '', body) {
    const isImage = contentType.split('/')[0] === 'image'
    if (!isImage) return null
    return <Tab key='tab-response-image' style={tabStyle} label='Image'>
      <span><img src={`data:${contentType.split(';')[0]};base64,${Buffer.from(body).toString('base64')}`} /></span>
    </Tab>
  }

  function hexTab (body = Buffer.alloc(0)) {
    if (body.length === 0) return null

    return <Tab key='tab-response-hex' style={tabStyle} label='Hex'>
      <Highlight className='no-highlight'>{hexer(Buffer.from(body), {group: 1})}</Highlight>
    </Tab>
  }

  function compressedTab (compressedBody = Buffer.alloc(0)) {
    if (compressedBody.length === 0) return null
    return <Tab key='tab-response-compressed' style={tabStyle} label='Compressed'>
      <Highlight className='no-highlight'>{hexer(compressedBody, {group: 1})}</Highlight>
    </Tab>
  }

  function rawTab (headers, body, response) {
    if (!headers) return null
    if (body.length === 0) return null
    if (!response) return null
    const contentType = headers['content-type']
    const raw = []
    raw.push(`HTTP/1.1 ${response.statusCode} ${response.statusMessage}`)
    raw.push(`${Object.keys(response.headers).map(h => `${h}: ${response.headers[h]}`).join('\n')}\n`)
    const encoding = isText(contentType) ? 'utf-8' : 'binary'
    raw.push(body.toString(encoding))
    return <Tab key='tab-response-raw' style={tabStyle} label='Raw'>
      <Highlight className='http'>{raw.join('\n')}</Highlight>
    </Tab>
  }

  function tabsFactory (headers, response, body = Buffer.alloc(0), compressedBody = Buffer.alloc(0)) {
    const contentType = headers ? headers['content-type'] : ''
    const tabs = []
    tabs.push(headersTab(headers))
    tabs.push(textTab(contentType, body))
    tabs.push(hexTab(body))
    tabs.push(compressedTab(compressedBody))
    tabs.push(htmlTab(contentType, body))
    tabs.push(jsonTab(contentType, body))
    tabs.push(imageTab(contentType, body))
    tabs.push(rawTab(headers, body, response))
    return tabs
  }

  const Tabs = (props) => {
    const tabs = tabsFactory(props.headers, props.response, props.body, props.compressedBody)
    return <WrappedComponent {...props} tabs={tabs} />
  }

  return Tabs
}

