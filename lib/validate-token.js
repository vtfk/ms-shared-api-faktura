const jwt = require('jsonwebtoken')
const getKeys = require('./get-keys')
const logger = require('./logger')

module.exports = async token => {
  logger('info', ['validate-token', 'start'])
  const decodedToken = jwt.decode(token, { complete: true })
  const keys = await getKeys()
  const { x5c } = keys.find(key => decodedToken.header.x5t === key.x5t)
  const pubCert = `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----`
  const verifiedToken = jwt.verify(token, pubCert)
  logger('info', ['validate-token', 'success'])
  return verifiedToken
}
