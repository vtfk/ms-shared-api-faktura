const { send } = require('micro')
const nanoid = require('nanoid')
const getUserName = require('./get-user-name')
const convert = require('./convert')
const getFaktura = require('./get-faktura')
const getBatches = require('./get-batches')
const createBatch = require('./create-batch')
const logger = require('./logger')

module.exports.getBatches = async (request, response) => {
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getBatches', 'userId', userId])
  try {
    const documents = await getBatches()
    logger('info', ['handle-faktura', 'getBatches', 'userId', userId, 'faktura', documents.length, 'success'])
    send(response, 200, documents.sort((a, b) => a.batchCreated < b.batchCreated))
  } catch (error) {
    logger('error', ['handle-faktura', 'getBatches', 'userId', userId, error])
    send(response, 500, error)
  }
}

module.exports.getFaktura = async (request, response) => {
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getFaktura', 'userId', userId])
  try {
    const documents = await getFaktura({ batchId: { '$exists': false } })
    logger('info', ['handle-faktura', 'getFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
    send(response, 200, documents)
  } catch (error) {
    logger('error', ['handle-faktura', 'getFaktura', 'userId', userId, error])
    send(response, 500, error)
  }
}

module.exports.getNewFaktura = async (request, response) => {
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getNewFaktura', 'userId', userId])
  try {
    const documents = await getFaktura({ batchId: { '$exists': false } })
    logger('info', ['handle-faktura', 'getNewFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
    send(response, 200, documents.length)
  } catch (error) {
    logger('error', ['handle-faktura', 'getNewFaktura', 'userId', userId, error])
    send(response, 500, error)
  }
}

module.exports.downloadBatch = async (request, response) => {
  let { batchId } = request.params
  const { upn } = request.token
  const userId = getUserName(upn)
  let batch = []
  logger('info', ['handle-faktura', 'downloadBatch', 'userId', userId, 'batchId', batchId])
  if (!batchId) {
    logger('info', ['handle-faktura', 'downloadBatch', 'userId', userId, 'generate batch'])
    batchId = nanoid()
    logger('info', ['handle-faktura', 'downloadBatch', 'userId', userId, 'batchId', batchId])
    batch = await createBatch(batchId, upn)
  } else {
    batch = await getFaktura({ batchId: batchId })
  }

  if (batch.length > 0) {
    const fileHeader = `attachment;filename=${batchId}.csv`
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type')
    response.setHeader('Content-Type', 'text/csv; charset=latin1')
    response.setHeader('Content-Disposition', fileHeader)
    send(response, 200, convert(batch))
  } else {
    send(response, 404, batch)
  }
}
