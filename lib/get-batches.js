const mongojs = require('mongojs')
const logger = require('./logger')
const db = mongojs(process.env.MONGODB_CONNECTION)
const faktura = db.collection(process.env.MONGODB_COLLECTION)

function getBatchIds () {
  return new Promise((resolve, reject) => {
    faktura.find({ batchId: { '$exists': true } }, (error, documents) => {
      if (error) {
        logger('error', ['get-batches', 'getBatchIds', error])
        return reject(error)
      } else {
        logger('info', ['get-batches', 'getBatchIds', 'documents', documents.length, 'success'])
        return resolve(documents.map(item => item.batchId).filter(item => item))
      }
    })
  })
}

function getOneFromBatch (batchId) {
  return new Promise((resolve, reject) => {
    faktura.findOne({ batchId: batchId }, (error, documents) => {
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
  return items.map(item => Object.assign({}, { batchId: item.batchId, batchCreated: item.batchCreated || new Date().getTime() }))
}
