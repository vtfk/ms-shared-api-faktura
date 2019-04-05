// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const cors = require('cors')
const whitelist = ['/docs', '/favicon.ico']
const machinelist = ['/samtykker']
const auth = require('./lib/token-auth')(whitelist, machinelist)

// Handlers
const handlers = require('./lib/handlers')
const handleFaktura = require('./lib/handle-faktura')

// Initialize a new router
const router = Router()

// CORS
router.use(cors())

// AUTH
router.use(auth)

// ROUTES
router.get('/docs', handlers.frontpage)
router.get('/', handleFaktura.getFaktura)
router.get('/new', handleFaktura.getNewFaktura)
router.get('/favicon.ico', handlers.favicon)
router.get('/batches', handleFaktura.getBatches)
router.get('/batches/download', handleFaktura.downloadBatch)
router.get('/batches/:batchId/download', handleFaktura.downloadBatch)

module.exports = (request, response) => {
  router(request, response, finalhandler(request, response))
}
