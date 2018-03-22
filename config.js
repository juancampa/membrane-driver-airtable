const { schema, imports, dependencies, environment, expressions, endpoints } = program;

environment
  .add('AIRTABLE_API_KEY', 'The API TOKEN')
  .add('AIRTABLE_ID', 'The Airtable Id')

//expressions
//  .add('url', '^https://airtable.com/.+$')

schema.type('Root')
  .computed('table', 'Table')
    .param('name', 'String')

schema.type('Table')
  .computed('name', 'String')
  .computed('records','RecordCollection')

schema.type('RecordCollection')
  .computed('one', 'Record')
    .param('id', 'String')
  .computed('items', '[Record]')
  // TODO params 
  
schema.type('Record')
  .computed('self', 'Record*')
  .field('id', 'String')
  .computed('fields', 'String')
  .field('createdTime','String')