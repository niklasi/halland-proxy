import { ipcRenderer } from 'electron'

export function addRequest (request) {
  return {type: 'ADD_REQUEST', payload: request}
}

export function addResponse (response) {
  return {type: 'ADD_RESPONSE', payload: response}
}

export function getRequestDetailsSuccess (data) {
  return {type: 'GET_REQUEST_DETAILS_SUCCESS', payload: data}
}

export function getRequestDetails (requestId) {
  return (dispatch) => {
    ipcRenderer.send('get-request-details', requestId)
    ipcRenderer.on('request-details', (e, details) => {
      dispatch(getRequestDetailsSuccess(details))
    })
  }
}
