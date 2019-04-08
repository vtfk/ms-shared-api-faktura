const mongojs = require('mongojs')
const logger = require('./logger')

function getBatchIds () {
  return new Promise((resolve, reject) => {
    const db = mongojs(process.env.MONGODB_CONNECTION)
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find({}, (error, documents) => {
      db.close()
      if (error) {
        logger('error', ['get-faktura', error])
        return reject(error)
      } else {
        logger('info', ['get-faktura', 'documents', documents.length, 'success'])
        return resolve(documents.map(item => item.batchId).filter(item => item))
      }
    })
  })
}

function getOneFromBatch (batchId) {
  return new Promise((resolve, reject) => {
    const db = mongojs(process.env.MONGODB_CONNECTION)
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.findOne({ batchId: batchId }, (error, documents) => {
      db.close()
      if (error) {
        logger('error', ['get-faktura', error])
        return reject(error)
      } else {
        logger('info', ['get-faktura', 'documents', documents.length, 'success'])
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
