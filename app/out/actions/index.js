module.exports = {
  addRequest: (request, response) => {
    return { type: 'ADD_REQUEST', request, response };
  },

  addResponse: response => {
    return { type: 'ADD_RESPONSE', response };
  }
};
//# sourceMappingURL=index.js.map