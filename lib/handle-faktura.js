const nanoid = require('nanoid')
const getUserName = require('./get-user-name')
const convert = require('./convert')
const getFaktura = require('./get-faktura')
const createBatch = require('./create-batch')
const logger = require('./logger')

module.exports.getFaktura = async (request, response) => {
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getFaktura', 'userId', userId])
  try {
    const documents = await getFaktura({ batchId: { '$exists': false } })
    logger('info', ['handle-faktura', 'getFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
    response.json(documents)
  } catch (error) {
    logger('error', ['handle-faktura', 'getFaktura', 'userId', userId, error])
    response.send(error)
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
    // response.setHeader('Content-Type', 'text/csv; charset=latin1')
    response.setHeader('Content-Disposition', fileHeader)
    response.send(convert(batch))
  } else {
    response.status(404)
    response.json(batch)
  }
}
