import { combineReducers } from 'redux'
import {
  ADD_REQUEST,
  ADD_RESPONSE,
  UPDATE_FILTER,
  GET_HTTP_MESSAGE_DETAILS_SUCCESS,
  TOGGLE_FILTER_INPUT
} from '../../constants/actionTypes'

function http (state = {
  messages: [],
  filter: [],
  filteredMessages: []
}, action) {
  function filterMessages (filter, messages) {
    if (state.filter.length > 0) {
      const regExpFilter = new RegExp(state.filter.join('|'), 'i')
      return state.messages.filter(x => regExpFilter.test(x.request.host))
    }

    return state.messages
  }

  switch (action.type) {
    case ADD_REQUEST:
      const id = action.payload.id
      const request = action.payload

      state.messages.push({ id, request })
      state.filteredMessages = filterMessages(state.filter, state.messages)

      return Object.assign({}, state)

    case ADD_RESPONSE:
      const responseIndex = state.messages.findIndex(item => item.id === action.payload.id)
      if (responseIndex === -1) return state

      const responseItem = state.messages[responseIndex]
      state.messages = []
        .concat(state.messages.slice(0, responseIndex))
        .concat([{ id: responseItem.id, request: responseItem.request, response: action.payload }])
        .concat(state.messages.slice(responseIndex + 1))

      state.filteredMessages = filterMessages(state.filter, state.messages)

      return Object.assign({}, state)

    case UPDATE_FILTER:
      state.filter = action.payload
      state.filteredMessages = filterMessages(state.filter, state.messages)

      return Object.assign({}, state)

    default:
      return state
  }
}

function ui (state = {
  displayFilter: false
}, action) {
  switch (action.type) {
    case TOGGLE_FILTER_INPUT:
      state.displayFilter = !state.displayFilter

      return Object.assign({}, state)
    default:
      return state
  }
}

function requestDetails (state = {}, action) {
  switch (action.type) {
    case GET_HTTP_MESSAGE_DETAILS_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({http, requestDetails, ui})
