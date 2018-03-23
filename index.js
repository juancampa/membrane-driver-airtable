import Airtable from 'airtable'

var base = new Airtable({ apiKey: 'keyYdvrG7aMuxeKMt' }).base(
  'appQq5qUm7VzgEMP3'
)

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
      .eachPage()

    return data
  },
}

export const Record = {
  self({ source, self }) {
    const { id } = source
    if (id === undefined || id === null) {
      return null
    }
    const { name } = self.match(root.table())
    return root.table({ name: name }).records.one({ id: id })
  },
  fields({ source }) {
    return JSON.stringify(source.fields)
  },
}

// //export async function parse({ name, value }) { }
