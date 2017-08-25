import React from 'react'
import {CardText} from 'material-ui/Card'
import prettyBytes from 'pretty-bytes'
import prettyMs from 'pretty-ms'

const RequestStats = ({ metadata = {} }) => {
  return <CardText>
    <div>Response time: {prettyMs(metadata.responseTime || 0)}</div>
    <div>Response size: {prettyBytes(metadata.responseSize || 0)}</div>
    <div>Dns lookup time: {prettyMs(metadata.dnsLookupTime || 0)}</div>
  </CardText>
}

export default RequestStats
