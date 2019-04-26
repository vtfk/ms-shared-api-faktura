const axios = require('axios')
const logger = require('./logger')

let keys = null

module.exports = async function getKnownKeys () {
  if (keys === null) {
    const autodiscoverUrl = 'https://login.microsoftonline.com/' + process.env.MOA_TENANT_ID + '/.well-known/openid-configuration'
    try {
      logger('info', ['get-keys', 'start', autodiscoverUrl])
      const { data: metadata } = await axios.get(autodiscoverUrl)
      logger('info', ['get-keys', 'got metadata', autodiscoverUrl])
      logger('info', ['get-keys', 'request keys', metadata.jwks_uri])
      const { data: keyData } = await axios.get(metadata.jwks_uri)
      logger('info', ['get-keys', 'got keys', metadata.jwks_uri])
      keys = keyData.keys
    } catch (error) {
      keys = null
      logger('error', error)
      throw error
    }
  } else {
    logger('info', ['get-keys', 'got keys', 'quick return'])
  }
  return keys
}
