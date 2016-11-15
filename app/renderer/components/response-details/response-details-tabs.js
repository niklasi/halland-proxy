import React from 'react'
import { Tabs } from 'material-ui/Tabs'
import decompressor from './decompressor'
import tabify from './tabify'

const tabItemContainerStyle = {
  backgroundColor: 'transparent'
}

const contentContainerStyle = {
  minHeight: '200px'
}

/* eslint-disable react/jsx-indent */
const ResponseDetailsTabs = ({ tabs }) => {
  return <Tabs contentContainerStyle={contentContainerStyle} tabItemContainerStyle={tabItemContainerStyle}>
    {
      tabs.map(tab => tab)
    }
  </Tabs>
}

export default decompressor(tabify(ResponseDetailsTabs))
/* eslint-enable react/jsx-indent */
