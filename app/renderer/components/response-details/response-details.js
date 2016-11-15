import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import ResponseTabs from './response-details-tabs'

/* eslint-disable react/jsx-indent */
export default ({ response = {}, request = {} }) => {
  return <div>
          <Card>
            <CardHeader title='Request' />
            <CardText>
              <ResponseTabs httpMessage={request} />
            </CardText>
          </Card>
          <Card>
            <CardHeader title='Response' />
            <CardText>
              <ResponseTabs httpMessage={response} />
            </CardText>
          </Card>
         </div>
}
/* eslint-enable react/jsx-indent */
