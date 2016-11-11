import React from 'react'
import tap from 'babel-tap'
import { shallow } from 'enzyme'
import Requests from '../../app/renderer/components/requests/request-pane'

tap.test('<Requests />', test => {
  shallow(<Requests request={{host: 'aaa', method: 'GET', httpVersion: '1.1'}} />)
  test.pass('this is ok')
  test.end()
})
