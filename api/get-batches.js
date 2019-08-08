const getUserName = require('../lib/get-user-name')
const getBatches = require('../lib/get-batches')
const logger = require('../lib/logger')
const whitelist = ['/docs', '/favicon.ico']
const machinelist = ['/samtykker']

async function getAllBatches (request, response) {
  if (request.method.toLowerCase() === 'options') {
    response.writeHead(200)
    response.end('')
  } else {
    const { upn } = request.token
    const userId = getUserName(upn)
    logger('info', ['getAllBatches', 'userId', userId])
    try {
      const documents = await getBatches()
      logger('info', ['getAllBatches', 'userId', userId, 'faktura', documents.length, 'success'])
      response.json(documents.sort((a, b) => a.batchCreated < b.batchCreated))
    } catch (error) {
      logger('error', ['getAllBatches', 'userId', userId, error])
      response.status(500)
      response.send(error)
    }
  }
}

module.exports = require('../lib/check-token')(whitelist, machinelist, getAllBatches)
