import React from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import RequestPaneToolbar from './request-pane-toolbar'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import muiThemeable from 'material-ui/styles/muiThemeable'

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

    return <div style={{display: 'flex'}}>
             <div style={{flex: '1 1 100%', overflowX: 'hidden'}}>
              <Card>
                <CardHeader
                  avatar={<Avatar>{response.statusCode}</Avatar>}
                  title={request.host}
                  subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
                  textStyle={{minWidth: '100%', maxWidth: '100%'}}
                  subtitleStyle={subtitleStyle}
                />
               <CardText />
             </Card>
            </div>
            <div style={{flex: '1 1 110px', backgroundColor: this.props.muiTheme.baseTheme.palette.canvasColor}}>
              <RequestPaneToolbar requestId={request.id} />
             </div>
          </div>
  }
}

export default muiThemeable()(RequestPane)
// Export without HoC to make testing easier
export { RequestPane }
/* eslint-enable react/jsx-indent */
