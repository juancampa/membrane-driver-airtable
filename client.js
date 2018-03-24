const { AIRTABLE_API_KEY, AIRTABLE_ID } = process.env

import Airtable from 'airtable'

export default const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_ID)
