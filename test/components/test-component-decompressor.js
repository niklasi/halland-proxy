import React from 'react'
import { test } from 'babel-tap'
import { shallow } from 'enzyme'
import decompressor from '../../src/renderer/components/http-message-details/decompressor'
import zlib from 'zlib'

function MockWrappedComponent () { return <div /> }

function component (httpMessage = {}) {
  const Wrapped = decompressor(MockWrappedComponent)
  return shallow(<Wrapped httpMessage={httpMessage} />)
}

test('renders wrapped component', t => {
  const wrappedComponent = component()
  t.ok(wrappedComponent)

  const props = wrappedComponent.props()
  t.same({}, props.httpMessage)
  t.same(Buffer.alloc(0), props.compressedBody)
  t.same(Buffer.alloc(0), props.body)

  t.end()
})

test('compressedBody is empty for uncompressed data', t => {
  const httpMessage = {
    body: {
      data: Buffer.from('a b c')
    }
  }
  const props = component(httpMessage).props()

  t.same(Buffer.alloc(0), props.compressedBody)
  t.end()
})

test('gzip compression', t => {
  const httpMessage = {
    headers: {
      'content-encoding': 'gzip'
    },
    body: {
      data: zlib.gzipSync(Buffer.from('a b c'))
    }
  }
  const props = component(httpMessage).props()

  t.ok(props.compressedBody.length > 0)
  t.same(Buffer.from('a b c'), props.body)
  t.end()
})

test('deflate compression', t => {
  const httpMessage = {
    headers: {
      'content-encoding': 'deflate'
    },
    body: {
      data: zlib.deflateSync(Buffer.from('a b c'))
    }
  }
  const props = component(httpMessage).props()

  t.ok(props.compressedBody.length > 0)
  t.same(Buffer.from('a b c'), props.body)
  t.end()
})
