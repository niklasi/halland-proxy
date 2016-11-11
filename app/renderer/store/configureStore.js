import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

export default (preloadedState) => {
  const middlewares = [thunk]

  if (process.env.NODE_ENV !== 'production') {
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
