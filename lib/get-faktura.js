const mongo = require('./mongo')
const logger = require('./logger')

module.exports = async query => {
  const db = await mongo()
  const faktura = db.collection(process.env.MONGODB_COLLECTION)
  try {
    const documents = await faktura.find(query).toArray()
    logger('info', ['get-faktura', 'documents', documents.length, 'success'])
    return documents
  } catch (error) {
    logger('error', ['get-faktura', error])
    throw error
  }
}
