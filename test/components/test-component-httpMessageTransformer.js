import React from 'react'
import { test } from 'babel-tap'
import { shallow } from 'enzyme'
import httpMessageTransformer from '../../app/renderer/components/http-message-details/httpMessageTransformer'
import zlib from 'zlib'

function MockWrappedComponent () { return <div /> }

function component (httpMessage = {}, body = Buffer.alloc(0), compressedBody = Buffer.alloc(0)) {
  const Wrapped = httpMessageTransformer(MockWrappedComponent)
  return shallow(<Wrapped httpMessage={httpMessage} body={body} compressedBody={compressedBody} />)
}

test('no transforms when props is empty', t => {
  const wrappedComponent = component()
  t.ok(wrappedComponent)

  const props = wrappedComponent.props()
  t.same([], props.transforms)

  t.end()
})

test('headers', t => {
  const httpMessage = {
    headers: {
      'server': 'nginx',
      'x-testing': 'yes'
    }
  }

  const transforms = component(httpMessage).props().transforms
  t.equal(2, transforms.length)
  t.same('headers', transforms[0].type)
  t.same('Headers', transforms[0].label)
  t.ok(transforms[0].content)

  t.same('Raw', transforms[1].label)
  t.end()
})

test('html', t => {
  const httpMessage = {
    headers: {
      'content-type': 'text/html',
      'server': 'nginx',
      'x-testing': 'yes'
    }
  }
  const body = Buffer.from('<html><head></head><body></body></html>')

  const transforms = component(httpMessage, body).props().transforms
  t.equal(5, transforms.length)

  t.same('headers', transforms[0].type)
  t.same('Headers', transforms[0].label)
  t.ok(transforms[0].content)

  t.same('text', transforms[1].type)
  t.same('Text', transforms[1].label)
  t.ok(transforms[1].content)

  t.same('hex', transforms[2].type)
  t.same('Hex', transforms[2].label)
  t.ok(transforms[2].content)

  t.same('html', transforms[3].type)
  t.same('Html', transforms[3].label)
  t.ok(transforms[3].content)

  t.same('http', transforms[4].type)
  t.same('Raw', transforms[4].label)
  t.ok(transforms[4].content)

  t.end()
})

test('json', t => {
  const httpMessage = {
    headers: {
      'content-type': 'application/json',
      'server': 'nginx',
      'x-testing': 'yes'
    }
  }
  const body = Buffer.from(JSON.stringify({server: 'Halland-Proxy', testing: true}))

  const transforms = component(httpMessage, body).props().transforms
  t.equal(5, transforms.length)

  t.same('headers', transforms[0].type)
  t.same('Headers', transforms[0].label)
  t.ok(transforms[0].content)

  t.same('text', transforms[1].type)
  t.same('Text', transforms[1].label)
  t.ok(transforms[1].content)

  t.same('hex', transforms[2].type)
  t.same('Hex', transforms[2].label)
  t.ok(transforms[2].content)

  t.same('json', transforms[3].type)
  t.same('Json', transforms[3].label)
  t.ok(transforms[3].content)

  t.same('http', transforms[4].type)
  t.same('Raw', transforms[4].label)
  t.ok(transforms[4].content)

  t.end()
})

test('compressed', t => {
  const httpMessage = {
    headers: {
      'content-type': 'application/json',
      'content-encoding': 'gzip',
      'server': 'nginx',
      'x-testing': 'yes'
    }
  }

  const body = Buffer.from(JSON.stringify({server: 'Halland-Proxy', testing: true}))
  const compressedBody = zlib.gzipSync(body)

  const transforms = component(httpMessage, body, compressedBody).props().transforms
  t.equal(6, transforms.length)

  t.same('headers', transforms[0].type)
  t.same('Headers', transforms[0].label)
  t.ok(transforms[0].content)

  t.same('text', transforms[1].type)
  t.same('Text', transforms[1].label)
  t.ok(transforms[1].content)

  t.same('hex', transforms[2].type)
  t.same('Hex', transforms[2].label)
  t.ok(transforms[2].content)

  t.same('compressed', transforms[3].type)
  t.same('Compressed', transforms[3].label)
  t.ok(transforms[3].content)

  t.same('json', transforms[4].type)
  t.same('Json', transforms[4].label)
  t.ok(transforms[4].content)

  t.same('http', transforms[5].type)
  t.same('Raw', transforms[5].label)
  t.ok(transforms[5].content)

  t.end()
})

test('image', t => {
  const httpMessage = {
    headers: {
      'content-type': 'image/png',
      'server': 'nginx',
      'x-testing': 'yes'
    }
  }

  const body = Buffer.from(`89504e470d0a1a0a0000000d49484452000000100000001008060000001ff3ff`, 'hex')

  const transforms = component(httpMessage, body).props().transforms
  t.equal(4, transforms.length)

  t.same('headers', transforms[0].type)
  t.same('Headers', transforms[0].label)
  t.ok(transforms[0].content)

  t.same('hex', transforms[1].type)
  t.same('Hex', transforms[1].label)
  t.ok(transforms[1].content)

  t.same('image', transforms[2].type)
  t.same('Image', transforms[2].label)
  t.ok(transforms[2].content)

  t.same('http', transforms[3].type)
  t.same('Raw', transforms[3].label)
  t.ok(transforms[3].content)

  t.end()
})
