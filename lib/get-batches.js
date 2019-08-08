const mongo = require('./mongo')
const logger = require('./logger')

async function getBatchIds () {
  const db = await mongo()
  const faktura = db.collection(process.env.MONGODB_COLLECTION)
  try {
    const batchIds = await faktura.distinct('batchId')
    logger('info', ['get-batches', 'getBatchIds', 'batchIds', batchIds.length, 'success'])
    return batchIds
  } catch (error) {
    logger('error', ['get-batches', 'getBatchIds', error])
    throw error
  }
}

async function getOneFromBatch (batchId) {
  const db = await mongo()
  return new Promise((resolve, reject) => {
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.findOne({ batchId: batchId }, { batchId: 1, batchCreated: 1, _id: 0 }, (error, documents) => {
      if (error) {
        logger('error', ['get-batches', 'getOneFromBatch', error])
        return reject(error)
      } else {
        logger('info', ['get-batches', 'getOneFromBatch', 'documents', documents.length, 'success'])
        return resolve(documents)
      }
    })
  })
}

module.exports = async () => {
  const batchIds = await getBatchIds()
  const jobs = batchIds.map(getOneFromBatch)
  const items = await Promise.all(jobs)
  return items
}
