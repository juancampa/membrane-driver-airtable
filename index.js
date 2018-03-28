import { base } from './client'

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
  async items({ args, self }) {
    const { name } = self.match(root.table())
    const options = {}
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
    ]
    for (let param of params) {
      if (args[param] !== undefined) {
        options[param] = args[param]
      }
    }
    const data = await base(name)
      .select({ ...options })
      .firstPage()
    return data
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
