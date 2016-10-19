const ipc = require('electron').ipcRenderer

function addRequest (request) {
  return {type: 'ADD_REQUEST', payload: request}
}

function addResponse (response) {
  return {type: 'ADD_RESPONSE', payload: response}
}

function getRequestDetailsSuccess (data) {
  return {type: 'GET_REQUEST_DETAILS_SUCCESS', payload: data}
}

function getRequestDetails (requestId) {
  return (dispatch) => {
    ipc.send('get-request-details', requestId)
    ipc.on('request-details', (e, response) => {
      dispatch(getRequestDetailsSuccess(response))
    })
  }
}

module.exports = { addRequest, addResponse, getRequestDetails }
