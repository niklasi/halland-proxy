const { createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk')
const rootReducer = require('../reducers')

module.exports = (preloadedState) => {
  const middlewares = [thunk]

  if (process.env.NODE_ENV === `development`) {
    const createLogger = require(`redux-logger`)
    const logger = createLogger()
    middlewares.push(logger)
  }

  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  )

  return store
}
