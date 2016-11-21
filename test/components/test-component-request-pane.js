import React from 'react'
import { test } from 'babel-tap'
import { shallow } from 'enzyme'
import { RequestPane } from '../../app/renderer/components/requests/request-pane'
import Toolbar from '../../app/renderer/components/requests/request-pane-toolbar'
import { CardHeader } from 'material-ui/Card'
import { getMuiTheme } from 'material-ui/styles'

const defaultRequest = {
  id: '123',
  host: 'www.ingholt.com',
  method: 'GET',
  paht: '/',
  httpVersion: '1.1'
}

function component (request = defaultRequest) {
  const darkBaseTheme = getMuiTheme({userAgent: 'tap'})
  return shallow(<RequestPane request={request} muiTheme={darkBaseTheme} />)
}

test('<RequestPane />', t => {
  t.ok(component())
  t.end()
})

test('render card header', t => {
  const header = component().find(CardHeader)
  t.equal(1, header.length)

  const props = header.props()
  t.same(defaultRequest.host, props.title)
  t.same(`${defaultRequest.method} ${defaultRequest.path} HTTP/${defaultRequest.httpVersion}`, props.subtitle)
  t.end()
})

test('render toolbar', t => {
  const toolbar = component().find(Toolbar)
  t.equal(1, toolbar.length)
  t.same({requestId: '123'}, toolbar.props())
  t.end()
})
