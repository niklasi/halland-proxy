import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import MessageTabs from './http-message-details-tabs'

/* eslint-disable react/jsx-indent */
export default ({ response = {}, request = {} }) => {
  return <div>
          <Card>
            <CardHeader title='Request' />
            <CardText>
              <MessageTabs httpMessage={request} />
            </CardText>
          </Card>
          <Card>
            <CardHeader title='Response' />
            <CardText>
              <MessageTabs httpMessage={response} />
            </CardText>
          </Card>
         </div>
}
/* eslint-enable react/jsx-indent */
