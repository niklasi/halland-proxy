const React = require('react')
const {Card, CardHeader, CardText} = require('material-ui/Card')
const Avatar = require('material-ui/Avatar').default
const {Toolbar, ToolbarGroup} = require('material-ui/Toolbar')
const RequestPaneToolbar = require('./request-pane-toolbar')
const PureRenderMixin = require('react-addons-pure-render-mixin')

/* eslint-disable react/jsx-indent */
class RequestPane extends React.Component {

  constructor (props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  render () {
    const { request, response } = this.props
    return <Card>
          <Toolbar>
            <ToolbarGroup firstChild>
              <CardHeader
                avatar={<Avatar>{response.statusCode}</Avatar>}
                title={request.host}
                subtitle={`${request.method} ${request.path} HTTP/${request.httpVersion}`}
              />
            </ToolbarGroup>
            <RequestPaneToolbar requestId={request.id} />
           </Toolbar>
           <CardText />
         </Card>
  }
}

module.exports = RequestPane
/* eslint-enable react/jsx-indent */
