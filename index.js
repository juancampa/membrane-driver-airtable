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
    const data = await base(name).find(args.id)
    return data
  },
  async page({ args, self }) {
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

    console.log('parameters ' + parameters)

    var options = {
      uri: `https://api.airtable.com/v0/${AIRTABLE_ID}/${name}?${parameters}`,
      json: true,
      headers: {
        authorization: 'Bearer ' + AIRTABLE_API_KEY,
      },
    }
    const result = await rp(options)

    console.log('result ' + JSON.stringify(result))

    return result
  },
}

export let RecordPage = {
  next({ self, source }) {
    if (source.offset === undefined) {
      return null
    }
    const args = self.match(root.table().records().page())
    return root.table().records().page({ ...args, offset: source.offset })
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
    const { name } = parent.match(root.table())
    return self || parent.ref.pop().push('one', { id: id })
  },
  fields({ source }) {
    return JSON.stringify(source.fields)
  },
}
