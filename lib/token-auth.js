const url = require('url')
const validateToken = require('./validate-token')
const validateMachineToken = require('./validate-machine-token')
const logger = require('./logger')

module.exports = (whitelist, machinelist) => {
  return async (request, response, next) => {
    if (request.method.toLowerCase() === 'options') {
      response.writeHead(200)
      response.end('')
    }
    const bearerToken = request.headers.authorization
    const pathname = url.parse(request.url).pathname
    const whitelisted = Array.isArray(whitelist) && whitelist.indexOf(pathname) >= 0
    const machinelisted = Array.isArray(machinelist) && machinelist.indexOf(pathname) >= 0
    if (!bearerToken && !whitelisted && !machinelisted) {
      const msg = 'missing Authorization header'
      logger('warn', ['token-auth', msg])
      response.writeHead(401)
      response.end('missing Authorization header')
      return
    }
    try {
      const token = bearerToken.replace('Bearer ', '')
      const validatedToken = machinelisted ? await validateMachineToken(token) : await validateToken(token)
      request.token = validatedToken
    } catch (error) {
      if (!whitelisted) {
        logger('error', ['token-auth', error])
        response.writeHead(401)
        response.end('invalid token in Authorization header')
        return
      }
    }
    next()
  }
}
