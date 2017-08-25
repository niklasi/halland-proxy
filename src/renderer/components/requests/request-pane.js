import React from 'react'
import {Card, CardHeader} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import RequestPaneToolbar from './request-pane-toolbar'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Stats from './request-stats'

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
      maxWidth: '95%'
    }

    const subtitle = `${request.method} ${request.path} HTTP/${request.httpVersion}`
    return <div style={{display: 'flex'}}>
             <div style={{flex: '1 1 100%', overflowX: 'hidden'}}>
              <Card>
                <CardHeader
                  avatar={<Avatar>{response.statusCode}</Avatar>}
                  title={request.host}
                  subtitle={subtitle}
                  textStyle={{minWidth: '100%', maxWidth: '100%'}}
                  subtitleStyle={subtitleStyle} />
              <Stats metadata={response.metadata} />
             </Card>
            </div>
            <div style={{flex: '1 1 140px', backgroundColor: this.props.muiTheme.baseTheme.palette.canvasColor}}>
              <RequestPaneToolbar requestId={request.id} />
             </div>
          </div>
  }
}

export default muiThemeable()(RequestPane)
// Export without HoC to make testing easier
export { RequestPane }
/* eslint-enable react/jsx-indent */
