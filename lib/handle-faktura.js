const { json, send } = require('micro')
const mongojs = require('mongojs')
const getUserName = require('./get-user-name')
const convert = require('./convert')
const buildSamtykke = require('./build-samtykke')
const logger = require('./logger')

module.exports.addSamtykke = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const samtykker = db.collection(process.env.MONGODB_COLLECTION)
  const { upn } = request.token
  const userId = getUserName(upn)
  const data = buildSamtykke(userId)
  samtykker.save(data, (error, result) => {
    db.close()
    if (error) {
      logger('error', ['handle-samtykker', 'addSamtykke', 'userId', userId, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-samtykker', 'addSamtykke', 'userId', userId, 'success'])
      send(response, 200, result)
    }
  })
}

module.exports.getSamtykke = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const samtykker = db.collection(process.env.MONGODB_COLLECTION)
  const { id } = request.params
  const samtykkeId = mongojs.ObjectId(id)
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-samtykker', 'getSamtykke', 'id', id, 'userId', userId])
  samtykker.find({ _id: samtykkeId, userId: userId }, (error, documents) => {
    db.close()
    if (error) {
      logger('error', ['handle-samtykker', 'getSamtykke', 'id', id, 'userId', userId, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-samtykker', 'getSamtykke', 'id', id, 'userId', userId, 'documents', documents.length, 'success'])
      send(response, 200, documents)
    }
  })
}

module.exports.getFaktura = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const faktura = db.collection(process.env.MONGODB_COLLECTION)
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getFaktura', 'userId', userId])
  faktura.find({}, (error, documents) => {
    db.close()
    if (error) {
      logger('error', ['handle-faktura', 'getFaktura', 'userId', userId, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-faktura', 'getFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
      send(response, 200, documents)
    }
  })
}

module.exports.getNewFaktura = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const faktura = db.collection(process.env.MONGODB_COLLECTION)
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'getFaktura', 'userId', userId])
  faktura.find({ batchId: { '$exists': false } }, (error, documents) => {
    db.close()
    if (error) {
      logger('error', ['handle-faktura', 'getFaktura', 'userId', userId, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-faktura', 'getFaktura', 'userId', userId, 'faktura', documents.length, 'success'])
      send(response, 200, documents.length)
    }
  })
}

module.exports.getSamtykkerForUserIds = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const samtykker = db.collection(process.env.MONGODB_COLLECTION)
  const data = await json(request)
  logger('info', ['handle-samtykker', 'getSamtykkerForUserIds', 'start'])
  samtykker.find({ 'userId': { '$in': data.userIds } }, (error, documents) => {
    db.close()
    if (error) {
      logger('error', ['handle-samtykker', 'getSamtykkerForUserIds', error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-samtykker', 'getSamtykkerForUserIds', 'documents', documents.length, 'success'])
      send(response, 200, documents)
    }
  })
}

module.exports.downloadBatch = async (request, response) => {
  const db = mongojs(process.env.MONGODB_CONNECTION)
  const samtykker = db.collection(process.env.MONGODB_COLLECTION)
  const { batchId } = request.params
  const { upn } = request.token
  const userId = getUserName(upn)
  logger('info', ['handle-faktura', 'downloadBatch', 'batchId', batchId])
  samtykker.find({ 'batchId': batchId }, (error, documents) => {
    db.close()
    if (error) {
      logger('error', ['handle-faktura', 'downloadBatch', 'batchId', batchId, 'userId', userId, error])
      send(response, 500, error)
    } else {
      logger('info', ['handle-faktura', 'downloadBatch', 'success', 'batchId', batchId, 'userId', userId])
      const fileHeader = `attachment;filename=${batchId}.csv`
      response.setHeader('Content-Type', 'text/csv; charset=latin1')
      response.setHeader('Content-Disposition', fileHeader)
      send(response, 200, convert(documents))
    }
  })
}
