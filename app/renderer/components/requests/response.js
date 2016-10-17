const zlib = require('zlib')
const Highlight = require('react-highlight')

module.exports = ({ response }) => {
  const unpack = () => {
    switch (response.headers['content-encoding']) {
      case 'gzip':
        return zlib.gunzipSync(response.body)
      case 'deflate':
        return zlib.deflateSync(response.body)
      default:
        return response.body
    }
  }

  const view = (body) => {
    const contentType = response.headers['content-type']
    if (/^text\//.test(contentType)) return body.toString()

    return ''
  }

  return <Highlight>{view(unpack())}</Highlight>
}
