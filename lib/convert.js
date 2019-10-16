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

// ugly fix for å komme rundt 60 tegnslimit på Visma
function fixNotes2 (data) {
  data.notes2 = data.notes2.replace('ta kontakt med skolen på telefon', 'ta kontakt med skolen')
  return data
}

module.exports = data => {
  const limitFixedData = data.map(fixNotes2)
  return parse(limitFixedData, parseOptions)
}
