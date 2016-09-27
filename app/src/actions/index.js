module.exports = {
  addRequest: (request) => {
    return {type: 'ADD_REQUEST', payload: request}
  },

  addResponse: (response) => {
    return {type: 'ADD_RESPONSE', payload: response}
  }
}
