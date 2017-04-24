import { ipcRenderer } from 'electron'
import { ADD_REQUEST, ADD_RESPONSE, GET_HTTP_MESSAGE_DETAILS_SUCCESS } from '../../constants/actionTypes'
import { REQUEST_HTTP_MESSAGE_DETAILS, HTTP_MESSAGE_DETAILS } from '../../constants/ipcMessages'
import { sendToProxyWindow } from '../../windows'

export function addRequest (request) {
  return {type: ADD_REQUEST, payload: request}
}

export function addResponse (response) {
  return {type: ADD_RESPONSE, payload: response}
}

export function getHttpMessageDetailsSuccess (data) {
  return {type: GET_HTTP_MESSAGE_DETAILS_SUCCESS, payload: data}
}

export function getHttpMessageDetails (requestId) {
  return (dispatch) => {
    sendToProxyWindow(REQUEST_HTTP_MESSAGE_DETAILS, requestId)
    ipcRenderer.on(HTTP_MESSAGE_DETAILS, (e, details) => {
      dispatch(getHttpMessageDetailsSuccess(details))
    })
  }
}
