import { base } from './client'

import { encode } from 'querystring'

import rp from 'request-promise'

const { AIRTABLE_API_KEY, AIRTABLE_ID } = process.env

const { root } = program.refs

export const Root = {
  table({ args }) {
    return args.name
  },
}

export const Table = {
  name({ self }) {
    const { name } = self.match(root.table())
    return name
  },
  records() {
    return {}
  },
  async createRecord({ args, self }) {
    const { name } = self.match(root.table())
    const fields = JSON.parse(args.fields)
    await base(name).create(fields)
  },
  async deleteRecord({ args, self }) {
    const { name } = self.match(root.table())
    const { id } = args
    await base(name).destroy(id)
  },
  async updateRecord({ args, self }) {
    const { name } = self.match(root.table())
    const { id } = args
    const fields = JSON.parse(args.fields)
    await base(name).update(id, fields)
  },
}

export const RecordCollection = {
  async one({ args, self }) {
    const { name } = self.match(root.table())
    let record;
    try {
      record = await base(name).find(args.id)
    } catch (e) {
      console.log("Error getting record:", e.message);
      return
    }
    return record
  },
  async page({ args, self }) {
    console.log('args ' + JSON.stringify(args))

    const { name } = self.match(root.table())
    const opts = {}
    const params = [
      'fields',
      'filterByFormula',
      'maxRecords',
      'pageSize',
      'sort',
      'view',
      'cellFormat',
      'timeZone',
      'userLocale',
      'offset',
    ]
    for (let param of params) {
      if (args[param] !== undefined) {
        opts[param] = args[param]
      }
    }

    const parameters = encode(opts)

    var options = {
      uri: `https://api.airtable.com/v0/${AIRTABLE_ID}/${name}?${parameters}`,
      json: true,
      headers: {
        authorization: 'Bearer ' + AIRTABLE_API_KEY,
      },
    }
    const result = await rp(options)

    return result
  },
}

export let RecordPage = {
  next({ self, source }) {
    if (source.offset === undefined) {
      return null
    }
    const { name } = self.match(root.table())
    const args = self.match(root.table().records().page())
    return root.table({name: name}).records().page({ ...args, offset: source.offset })
  },
  items({ source }) {
    return source.records
  },
}

export const Record = {
  self({ source, self, parent }) {
    const { id } = source
    if (id === undefined || id === null) {
      return null
    }
    if (self) {
      return self;
    }
    const { name } = parent.match(root.table())
    return parent.ref.pop().pop().push('one', { id: id })
  },
  fields({ source }) {
    return JSON.stringify(source.fields)
  },
}
