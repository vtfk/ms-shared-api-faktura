const mongo = require('./mongo')
const logger = require('./logger')

module.exports = async query => {
  const db = await mongo()
  return new Promise((resolve, reject) => {
    const faktura = db.collection(process.env.MONGODB_COLLECTION)
    faktura.find(query).toArray((error, documents) => {
      if (error) {
        logger('error', ['get-faktura', error])
        return reject(error)
      } else {
        console.log(documents)
        logger('info', ['get-faktura', 'documents', documents.length, 'success'])
        return resolve(documents)
      }
    })
  })
}
