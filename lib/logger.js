const { name, version } = require('../package.json')

module.exports = (level, message) => {
  const data = Array.isArray(message) ? message : [message]
  console.log(`${new Date().toUTCString()} - ${level.toUpperCase()} - ${name} - ${version}: ${data.join(' - ')}`)
}
