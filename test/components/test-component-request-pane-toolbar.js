import React from 'react'
import { Link } from 'react-router'
import { test } from 'babel-tap'
import { shallow } from 'enzyme'
import Toolbar from '../../app/renderer/components/requests/request-pane-toolbar'

function component (requestId = '123') {
  return shallow(<Toolbar requestId={requestId} />)
}

test('<RequestPaneToolbar />', t => {
  t.ok(component())
  t.end()
})

test('render Link', t => {
  const requestId = 'abc'
  const link = component(requestId).find(Link)
  t.equal(1, link.length)
  t.same(`/requests/${requestId}`, link.props().to)
  t.end()
})
