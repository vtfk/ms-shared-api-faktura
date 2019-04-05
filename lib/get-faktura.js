const mongojs = require('mongojs')
const logger = require('./logger')

module.exports = query => {
  return new Promise((resolve, reject) => {
    const db = mongojs(process.env.MONGODB_CONNECTION)
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find(query, (error, documents) => {
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
