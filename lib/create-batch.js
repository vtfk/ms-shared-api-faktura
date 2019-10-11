const { ObjectId } = require('mongodb')
const mongo = require('./mongo')
const logger = require('./logger')

async function getFaktura () {
  logger('info', ['create-batch', 'getFaktura'])
  const db = await mongo()
  return new Promise((resolve, reject) => {
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find({ batchId: { $exists: false } }).limit(50).toArray((error, documents) => {
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

async function setBatch (batch, batchId, creator) {
  logger('info', ['create-batch', 'setBatch'])
  const db = await mongo()
  /*
  const faktura = db.collection(process.env.MONGODB_COLLECTION)
  const ids = batch.map(item => ObjectId(item._id))
  const update = {
    batchCreatedBy: creator,
    batchCreated: new Date().getTime(),
    batchId: batchId
  }
  const jobs = ids.map(async id => faktura.update({ _id: id }, { $set: update }))
  try {
    const result = await Promise.all(jobs)
    logger('info', ['create-batch', 'setBatch', 'batchId', batchId, 'documents', jobs.length, 'success'])
    return result
  } catch (error) {
    logger('error', ['create-batch', 'setBatch', 'batchId', batchId, error])
    throw error
  }
  */
  return new Promise((resolve, reject) => {
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    const ids = batch.map(item => ObjectId(item._id))
    const shrdKey = process.env.MONGODB_SHARD_KEY
    const update = {
      batchCreatedBy: creator,
      batchCreated: new Date().getTime(),
      batchId: batchId
    }
    faktura.updateMany({ _id: { $in: ids }, shrdKey }, { $set: update }, (error, documents) => {
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
