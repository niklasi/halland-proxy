const React = require('react')
const {Card, CardActions, CardHeader, CardText} = require('material-ui/Card')
const FlatButton = require('material-ui/FlatButton').default

module.exports = ({request, response}) => <Card>
                                            <CardHeader
                                              title={request.headers.host + request.url}
                                              subtitle={request.method + ' ' + response.statusCode}
                                              actAsExpander
                                              showExpandableButton />
                                            <CardActions>
                                              <FlatButton label='Action1' />
                                              <FlatButton label='Action2' />
                                            </CardActions>
                                            <CardText expandable>
                                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin.
                                              Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                                            </CardText>
                                          </Card>
