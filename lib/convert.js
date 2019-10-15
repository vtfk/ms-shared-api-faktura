const { parse } = require('json2csv')

const parseOptions = {
  header: false,
  quote: '',
  delimiter: ';',
  eol: '\r\n',
  fields: [
    'id',
    'name',
    'address1',
    'addresse2',
    'zip',
    'city',
    'mobile',
    'email',
    'partNumber',
    'amount',
    'qty',
    'notes1',
    'notes2'
  ]
}

module.exports = data => {
  return parse(data, parseOptions)
}
