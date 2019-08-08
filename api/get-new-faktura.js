const getUserName = require('../lib/get-user-name')
const getFaktura = require('../lib/get-faktura')
const logger = require('../lib/logger')
const whitelist = ['/docs', '/favicon.ico']
const machinelist = ['/samtykker']

async function getNewFaktura (request, response) {
  if (request.method.toLowerCase() === 'options') {
    response.writeHead(200)
    response.end('')
  } else {
    const { upn } = request.token
    const userId = getUserName(upn)
    logger('info', ['getNewFaktura', 'userId', userId])
    try {
      const documents = await getFaktura({ batchId: { $exists: false } })
      logger('info', ['getNewFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
      response.send(documents.length)
    } catch (error) {
      logger('error', ['getNewFaktura', 'userId', userId, error])
      response.status(500)
      response.send(error)
    }
  }
}

module.exports = require('../lib/check-token')(whitelist, machinelist, getNewFaktura)
