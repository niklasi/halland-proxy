import React from 'react'
import hexer from 'hexer'

export default function httpMessageTransformer (WrappedComponent) {
  function transformHeaders (headers) {
    if (!headers) return null

    return {
      type: 'headers',
      label: 'Headers',
      content: headers
    }
  }

  function isText (contentType = '') {
    return contentType.split('/')[0] === 'text' || contentType.split(';')[0] === 'application/json'
  }

  function transformText (contentType = '', body) {
    if (!isText(contentType)) return null

    return {
      type: 'text',
      label: 'Text',
      content: body.toString()
    }
  }

  function transformHtml (contentType = '', body) {
    const isHtml = contentType.split(';')[0] === 'text/html'
    if (!isHtml) return null

    return {
      type: 'html',
      label: 'Html',
      content: body.toString()
    }
  }

  function transformJson (contentType = '', body) {
    const isJson = contentType.split(';')[0] === 'application/json'
    if (!isJson) return null

    return {
      type: 'json',
      label: 'Json',
      content: JSON.stringify(JSON.parse(body.toString()), null, ' ')
    }
  }

  function transformImage (contentType = '', body) {
    const isImage = contentType.split('/')[0] === 'image'
    if (!isImage) return null

    return {
      type: 'image',
      label: 'Image',
      content: `data:${contentType.split(';')[0]};base64,${Buffer.from(body).toString('base64')}`
    }
  }

  function transformHex (body = Buffer.alloc(0)) {
    if (body.length === 0) return null

    return {
      type: 'hex',
      label: 'Hex',
      content: hexer(Buffer.from(body), {group: 1})
    }
  }

  function transformCompressed (compressedBody = Buffer.alloc(0)) {
    if (compressedBody.length === 0) return null

    return {
      type: 'compressed',
      label: 'Compressed',
      content: hexer(compressedBody, {group: 1})
    }
  }

  function transformRaw (startLine, headers, body) {
    if (!headers) return null
    const contentType = headers['content-type']
    const raw = []
    raw.push(startLine)
    raw.push(`${Object.keys(headers).map(h => `${h}: ${headers[h]}`).join('\n')}\n`)
    const encoding = isText(contentType) ? 'utf-8' : 'binary'
    raw.push(body.toString(encoding))

    return {
      type: 'http',
      label: 'Raw',
      content: raw.join('\n')
    }
  }

  function getStartLine (httpMessage) {
    const { method, statusCode, statusMessage, path, httpVersion } = httpMessage

    // request
    if (method) {
      return `${method} ${path} HTTP/${httpVersion}`
    }

    // response
    return `HTTP/${httpVersion} ${statusCode} ${statusMessage}`
  }

  const Transforms = ({ httpMessage, body, compressedBody }) => {
    const contentType = httpMessage.headers ? httpMessage.headers['content-type'] : ''
    const headers = httpMessage.headers
    const transforms = []
    transforms.push(transformHeaders(headers))
    transforms.push(transformText(contentType, body))
    transforms.push(transformHex(body))
    transforms.push(transformCompressed(compressedBody))
    transforms.push(transformHtml(contentType, body))
    transforms.push(transformJson(contentType, body))
    transforms.push(transformImage(contentType, body))
    const startLine = getStartLine(httpMessage)
    transforms.push(transformRaw(startLine, headers, body))
    return <WrappedComponent transforms={transforms.filter(transform => transform !== null)} />
  }

  return Transforms
}
