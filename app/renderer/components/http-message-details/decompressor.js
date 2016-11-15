import React from 'react'
import zlib from 'zlib'

export default function decompressor (WrappedComponent) {
  function decompress (body, contentEncoding) {
    switch (contentEncoding) {
      case 'gzip':
        return zlib.gunzipSync(body)
      case 'deflate':
        return zlib.deflateSync(body)
      default:
        return body
    }
  }

  const Decompressor = (props) => {
    const body = props.httpMessage.body ? Buffer.from(props.httpMessage.body.data) : Buffer.alloc(0)

    const contentEncoding = props.httpMessage.headers ? props.httpMessage.headers['content-encoding'] : ''
    const decompressedBody = decompress(body, contentEncoding)
    const compressedBody = body === decompressedBody ? Buffer.alloc(0) : body

    return <WrappedComponent {...props} compressedBody={compressedBody} body={decompressedBody} />
  }

  return Decompressor
}
