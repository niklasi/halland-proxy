const React = require('react')
const {Card, CardActions, CardHeader, CardText} = require('material-ui/Card')
const FlatButton = require('material-ui/FlatButton').default
const BrowserWindow = require('electron').remote.BrowserWindow
const fs = require('fs')
const path = require('path')

module.exports = ({request, response}) => {
  const showDetails = (e) => {
    let win = new BrowserWindow({ width: 400, height: 640 })
    win.on('close', function () { win = null })
    const writer = fs.createWriteStream('/tmp/response.html')
    console.log('Responsen', response)
    response.pipe(writer).on('end', () => {
      const modalPath = path.join('file://', 'tmp/response.html')
      win.loadURL(modalPath)
      win.show()
    })
  }

  return <Card>
           <CardHeader
             title={request.headers.host + request.url}
             subtitle={request.method + ' ' + response.statusCode}
             actAsExpander
             showExpandableButton />
           <CardActions>
             <FlatButton label='Details' onTouchTap={showDetails} />
             <FlatButton label='Action2' />
           </CardActions>
           <CardText expandable>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin.
             Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
           </CardText>
         </Card>
}