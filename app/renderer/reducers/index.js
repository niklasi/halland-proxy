const { combineReducers } = require('redux')

const requests = (state = [], action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      const id = action.payload.id
      const request = action.payload
      return state.concat([{ id, request }])

    case 'ADD_RESPONSE':
      const responseIndex = state.findIndex(item => item.id === action.payload.id)
      if (responseIndex === -1) return state.concat([{ id: action.payload.id, response: action.payload }])

      const responseItem = state[responseIndex]
      return [].concat(state.slice(0, responseIndex)).concat([{ id: responseItem.id, request: responseItem.request, response: action.payload }]).concat(state.slice(responseIndex + 1))
    default:
      return state
  }
}

module.exports = combineReducers({requests})
