import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs'
import decompressor from './decompressor'
import httpMessageTransformer from './httpMessageTransformer'
import Highlight from 'react-highlight'
import Headers from '../requests/headers'

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
const MessageDetailsTabs = ({ transforms }) => {
  return <Tabs contentContainerStyle={contentContainerStyle} tabItemContainerStyle={tabItemContainerStyle}>
    {
      transforms.map((transform, index) => {
        switch (transform.type) {
          case 'headers':
            return <Tab key={`transform-${index}`} style={tabStyle} label={transform.label}>
              <Headers headers={transform.content} />
            </Tab>
          case 'text':
          case 'html':
          case 'json':
          case 'http':
            return <Tab key={`tab-${index}`} style={tabStyle} label={transform.label}>
              <Highlight className={transform.type}>{transform.content}</Highlight>
            </Tab>
          case 'compressed':
          case 'hex':
            return <Tab key={`tab-${index}`} style={tabStyle} label={transform.label}>
              <Highlight className='no-highlight'>{transform.content}</Highlight>
            </Tab>
          case 'image':
            return <Tab key={`tab-${index}`} style={tabStyle} label={transform.label}>
              <span><img src={transform.content} /></span>
            </Tab>
        }
      })
    }
  </Tabs>
}

export default decompressor(httpMessageTransformer(MessageDetailsTabs))
/* eslint-enable react/jsx-indent */
