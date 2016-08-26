const { combineReducers } = require('redux')

const requests = (state, action) => {
  state = state || []
  switch (action.type) {
    case 'ADD_REQUEST':
      return state.concat([action.request])
    default:
      return state
  }
}

module.exports = combineReducers({requests})
