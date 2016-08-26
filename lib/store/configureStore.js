const { createStore, applyMiddleware } = require('redux')
const thunkMiddleware = require('redux-thunk')
const createLogger = require('redux-logger')
const rootReducer = require('../reducers')

module.exports = (preloadedState) => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, createLogger())
  )

  return store
}
