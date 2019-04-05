const readFileSync = require('fs').readFileSync
const md = require('markdown-it')()
const { send } = require('micro')
const logger = require('./logger')

exports.frontpage = (request, response) => {
  logger('info', ['handlers', 'frontpage'])
  const readme = readFileSync(`${__dirname}/../README.md`, 'utf-8')
  send(response, 200, md.render(readme))
}

exports.favicon = (request, response) => {
  logger('info', ['handlers', 'favicon'])
  return ''
}
