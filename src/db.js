import levelup from 'levelup'
import bytewise from 'bytewise'

export default ({ path, backingStore = 'memory' }) => {
  const options = {
    db: backingStore === 'memory' ? require('memdown') : require('leveldown'),
    keyEncoding: bytewise,
    valueEncoding: 'json'
  }

  return levelup(path, options)
}
