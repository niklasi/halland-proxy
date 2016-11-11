import { ipcRenderer } from 'electron'
import { ADD_REQUEST, ADD_RESPONSE, GET_REQUEST_DETAILS_SUCCESS } from '../../constants/actionTypes'
import { GET_REQUEST_DETAILS, REQUEST_DETAILS } from '../../constants/ipcMessages'

export function addRequest (request) {
  return {type: ADD_REQUEST, payload: request}
}

export function addResponse (response) {
  return {type: ADD_RESPONSE, payload: response}
}

export function getRequestDetailsSuccess (data) {
  return {type: GET_REQUEST_DETAILS_SUCCESS, payload: data}
}

export function getRequestDetails (requestId) {
  return (dispatch) => {
    ipcRenderer.send(GET_REQUEST_DETAILS, requestId)
    ipcRenderer.on(REQUEST_DETAILS, (e, details) => {
      dispatch(getRequestDetailsSuccess(details))
    })
  }
}
