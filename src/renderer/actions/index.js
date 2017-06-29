import { ipcRenderer } from 'electron'
import { ADD_REQUEST, ADD_RESPONSE, GET_HTTP_MESSAGE_DETAILS_SUCCESS } from '../../constants/actionTypes'
import { REQUEST_HTTP_MESSAGE_DETAILS, HTTP_MESSAGE_DETAILS, HTTP_MESSAGE_REQUEST, REQUEST_HTTP_MESSAGE_REQUEST } from '../../constants/ipcMessages'
import { sendToProxyWindow } from '../../windows'
import http from 'http'
import { load as loadConfig } from '../../lib/config'

const config = loadConfig()

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

export function replayRequest (requestId) {
  return (dispatch) => {
    sendToProxyWindow(REQUEST_HTTP_MESSAGE_REQUEST, requestId)
    ipcRenderer.once(HTTP_MESSAGE_REQUEST, (e, request) => {

      const options = {
        port: config.port,
        hostname: 'localhost',
        method: request.method,
        path: `${request.protocol}//${request.host}${request.path}`,
        headers: request.headers
      };

      const req = http.request(options);
      req.write(Buffer.from(request.body.data))
      req.end();
    })
  }
}
