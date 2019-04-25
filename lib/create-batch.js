const { ObjectId } = require('mongodb')
const mongo = require('./mongo')
const logger = require('./logger')

function getFaktura () {
  return new Promise(async (resolve, reject) => {
    logger('info', ['create-batch', 'getFaktura'])
    const db = await mongo()
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find({ batchId: { '$exists': false } }).limit(100).toArray((error, documents) => {
      if (error) {
        logger('error', ['create-batch', 'getFaktura', error])
        return reject(error)
      } else {
        logger('info', ['create-batch', 'getFaktura', 'documents', documents.length, 'success'])
        return resolve(documents)
      }
    })
  })
}

function setBatch (batch, batchId, creator) {
  return new Promise(async (resolve, reject) => {
    logger('info', ['create-batch', 'setBatch'])
    const db = await mongo()
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    const ids = batch.map(item => ObjectId(item._id))
    const update = {
      batchCreatedBy: creator,
      batchCreated: new Date().getTime(),
      batchId: batchId
    }
    faktura.updateMany({ _id: { '$in': ids } }, { '$set': update }, (error, documents) => {
      if (error) {
        logger('error', ['create-batch', 'setBatch', 'batchId', batchId, error])
        return reject(error)
      } else {
        logger('info', ['create-batch', 'setBatch', 'batchId', batchId, 'documents', documents.length, 'success'])
        return resolve(documents)
      }
    })
  })
}

module.exports = async (batchId, creator) => {
  const batch = await getFaktura()
  if (batch.length > 0) {
    await setBatch(batch, batchId, creator)
  }
  return batch
}
