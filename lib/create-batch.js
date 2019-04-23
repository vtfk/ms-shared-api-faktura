const mongojs = require('mongojs')
const logger = require('./logger')

function getFaktura () {
  return new Promise((resolve, reject) => {
    logger('info', ['create-batch', 'getFaktura'])
    const db = mongojs(process.env.MONGODB_CONNECTION)
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find({ batchId: { '$exists': false } }).limit(100, (error, documents) => {
      db.close()
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

function setBatch (batch, batchId) {
  return new Promise((resolve, reject) => {
    logger('info', ['create-batch', 'setBatch'])
    const db = mongojs(process.env.MONGODB_CONNECTION)
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    const ids = batch.map(item => mongojs.ObjectID(item._id))
    const update = {
      batchCreated: new Date().getTime(),
      batchId: batchId
    }
    faktura.update({ _id: { '$in': ids } }, { '$set': update }, { multi: true }, (error, documents) => {
      db.close()
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

module.exports = async batchId => {
  const batch = await getFaktura()
  if (batch.length > 0) {
    await setBatch(batch, batchId)
  }
  return batch
}
