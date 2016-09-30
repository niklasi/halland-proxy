const levelup = require('levelup')
const bytewise = require('bytewise')

module.exports = ({ path, backingStore = 'memory' }) => {
  const options = {
    db: backingStore === 'memory' ? require('memdown') : require('leveldown'),
    keyEncoding: bytewise,
    valueEncoding: 'json'
  }

  return levelup(path, options)
}
