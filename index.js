// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const whitelist = ['/docs', '/favicon.ico']
const machinelist = ['/samtykker']
const auth = require('./lib/token-auth')(whitelist, machinelist)
const logger = require('./lib/logger')

// Handlers
const handleFaktura = require('./lib/handle-faktura')

// Initialize a new router
const router = Router()

// AUTH
router.use(auth)

// ROUTES
router.get('/', handleFaktura.getFaktura)
router.get('/batches/download', handleFaktura.downloadBatch)
router.get('/batches/:batchId/download', handleFaktura.downloadBatch)

module.exports = (request, response) => {
  if (request.method.toLowerCase() === 'options') {
    logger('info', ['preflight', 'quick return'])
    response.writeHead(200)
    response.end('')
  } else {
    router(request, response, finalhandler(request, response))
  }
}
