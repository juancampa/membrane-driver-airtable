import { base } from './client'
import { escape } from 'querystring'

const { root } = program.refs

export async function init() {
  await root.set({
    table: {},
  })
}

 export const RecordCollection = {}
 export const Table = {}
 export const Record = {}

// export const RecordsCollection = {
//   async one({ args }) {
//     const table = escape(args.table)
//     const result = await get(`/${table}/${args.id}`)
//     return result
//   },
//   async items({ args }) {
//     const table = escape(args.table)
//     console.log('Table ' + table)
//     const result = await get(`/${table}`)
//     return result.records
//   },
// }

// export const RecordItems = {
//   self({ source }) {
//     console.log('source: ' + source)
//     // the table is required. 
//     // Voyager.com is for testing
//     return root.records.one({ id: source.id, table:'Voyager.com' })
//   },
// }

// export const Record = {
//   self({ source }) {
//     console.log('source: ' + source)
//     // the table is required. 
//     // Voyager.com is for testing
//     return root.records.one({ id: source.id, table:'Voyager.com' })
//   },
//   fields({ source }){
//     return JSON.stringify(source.fields)
//   }
// }

// //export async function parse({ name, value }) { }
