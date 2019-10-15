const nanoid = require('nanoid')
const { tmpdir } = require('os')
const { readFile, unlink, writeFile } = require('fs').promises
const getUserName = require('./get-user-name')
const convert = require('./convert')
const getFaktura = require('./get-faktura')
const createBatch = require('./create-batch')
const logger = require('./logger')

module.exports.getFaktura = async (request, response) => {
  const { upn } = request.token
  const userId = getUserName(upn)
  const shrdKey = process.env.MONGODB_SHARD_KEY
  logger('info', ['handle-faktura', 'getFaktura', 'userId', userId])
  try {
    const documents = await getFaktura({ batchId: { $exists: false }, shrdKey })
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
    const content = convert(batch)
    const fileName = `${tmpdir()}/${batchId}.csv`
    const fileHeader = `attachment;filename=${batchId}.csv`
    await writeFile(fileName, content, 'latin1')
    const data = await readFile(fileName)
    await unlink(fileName)
    response.setHeader('Content-Type', 'text/csv; charset=latin1')
    response.setHeader('Content-Disposition', fileHeader)
    response.end(data)
  } else {
    response.status(404)
    response.json(batch)
  }
}
