import React from 'react'

const transformHeaders = (headers) => {
  return Object.keys(headers).map(header => {
    return {key: header, value: headers[header]}
  })
}

const headerMapper = (header, index) => <li key={`${header.key}-${index}`}>{`${header.key}: ${header.value}`}</li>

export default ({ headers }) => <ul>{transformHeaders(headers).map(headerMapper)}</ul>
