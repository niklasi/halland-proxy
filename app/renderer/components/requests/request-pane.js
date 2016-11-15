import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import RequestPaneToolbar from './request-pane-toolbar'
import PureRenderMixin from 'react-addons-pure-render-mixin'

/* eslint-disable react/jsx-indent */
class RequestPane extends React.Component {

  constructor (props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    const { request, response = {} } = this.props

    const subtitleStyle = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%'
    }

    return <Card>
            <Toolbar>
              <ToolbarGroup style={{maxWidth: '90%'}} firstChild>
                <CardHeader
                  style={{maxWidth: '100%'}}
                  avatar={<Avatar>{response.statusCode}</Avatar>}
                  title={request.host}
                  textStyle={{maxWidth: '100%'}}
                  subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
                  subtitleStyle={subtitleStyle}
                />
              </ToolbarGroup>
              <RequestPaneToolbar requestId={request.id} />
             </Toolbar>
             <CardText />
           </Card>
  }
}

export default RequestPane
/* eslint-enable react/jsx-indent */
