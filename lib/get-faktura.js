const mongo = require('./mongo')
const logger = require('./logger')

module.exports = query => {
  return new Promise(async (resolve, reject) => {
    const db = await mongo()
    db.find(query, (error, documents) => {
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
