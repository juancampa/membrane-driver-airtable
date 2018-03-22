const { schema, imports, dependencies, environment, expressions, endpoints } = program;

environment
  .add('API_KEY', 'The API TOKEN')
  .add('AIRTABLE_ID', 'The Airtable Id')

//expressions
//  .add('url', '^https://airtable.com/.+$')

schema.type('Root')
  .field('records', 'RecordsCollection')

schema.type('RecordsCollection')
  .computed('one', 'Record')
    .param('id', 'String', 'Record id')
    .param('table', 'String', 'The table of the airtable')
  .computed('items', 'RecordItems')
    .param('table', 'String', 'The table of the airtable')

schema.type('RecordItems')
  .computed('self', 'RecordItems*')
  .field('records', '[Record]')
  .field('offset', 'String')

schema.type('Record')
  .computed('self', 'Record*')
  .field('id', 'String')
  .computed('fields', 'String')
  .field('createdTime','String')