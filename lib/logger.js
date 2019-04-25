const { name, version } = require('../package.json')

module.exports = (level, message) => {
  const data = Array.isArray(message) ? message : [message]
  const logger = level.toLowerCase() === 'error' ? console.error : console.log
  return logger(`${new Date().toUTCString()} - ${level.toUpperCase()} - ${name} - ${version}: ${data.join(' - ')}`)
}
