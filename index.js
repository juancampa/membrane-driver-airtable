import { base } from './client'
import { escape } from 'querystring'

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
  records({ self }) {
    const { name } = self.match(root.table())
    return root.table({ name: name }).records.items()
  },
}

export const RecordCollection = {
  async one({ args }) {
    base(args.table).find(args.id, function(err, record) {
      if (err) {
        console.error(err)
        return
      }
      console.log(record)
    })
  },
  async items({ args }) {
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

    base(args.table)
      .select(options)
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          console.log(records)

          // records.forEach(function(record) {
          //  console.log('Retrieved', record.get('Name'))
          //})

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
            return
          }
        }
      )
  },
}

// export const RecordItems = {
//   self({ source }) {
//     console.log('source: ' + source)
//     // the table is required.
//     // Voyager.com is for testing
//     return root.records.one({ id: source.id, table:'Voyager.com' })
//   },
// }

export const Record = {
  self({ source, self }) {
    const { name } = self.match(root.table())

    return root.table({ table: name }).records.one({ id: source.id })
  },
  fields({ source }) {
    return JSON.stringify(source.fields)
  },
}

// //export async function parse({ name, value }) { }
