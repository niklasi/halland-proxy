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
    return <Card>
            <Toolbar>
              <ToolbarGroup firstChild>
                <CardHeader
                  avatar={<Avatar>{response.statusCode}</Avatar>}
                  title={request.host}
                  subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
                  subtitleStyle={{maxWidth: '700px', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}
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
