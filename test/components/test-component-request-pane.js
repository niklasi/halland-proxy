const React = require('react')
const tap = require('babel-tap')
const { shallow } = require('enzyme')
const Requests = require('../../app/renderer/components/requests/request-pane')

tap.test('<Requests />', test => {
  shallow(<Requests request={{host: 'aaa', method: 'GET', httpVersion: '1.1'}} />)
  test.pass('this is ok')
  test.end()
})
