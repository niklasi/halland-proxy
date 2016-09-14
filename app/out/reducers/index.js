const { combineReducers } = require('redux');

const requests = (state, action) => {
  state = state || [];
  switch (action.type) {
    case 'ADD_REQUEST':
      const { request, response } = action;
      return state.concat([{ request, response }]);
    case 'ADD_RESPONSE':
      return state;
    //   return state.concat([action.response])
    default:
      return state;
  }
};

module.exports = combineReducers({ requests });
//# sourceMappingURL=index.js.map