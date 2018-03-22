import { get, post } from './client'
import { parse as parseUrl } from 'url'
import { escape } from 'querystring'

const { root } = program.refs

export async function init() {
  await root.set({
    records: {},
  })
}

export const Root = {}

export const RecordsCollection = {
  async one({ args }) {
    const table = escape(args.table)
    const result = await get(`/${table}/${args.id}`)
    return result
  },
  async items({ args }) {
    const table = escape(args.table)
    const result = await get(`/${table}`)
    return result
  },
}

export const RecordItems = {
  self({ source }) {
    console.log('source: ' + source)
    // the table is required. 
    // Voyager.com is for testing
    return root.records.one({ id: source.id, table:'Voyager.com' })
  },
}

export const Record = {
  self({ source }) {
    console.log('source: ' + source)
    // the table is required. 
    // Voyager.com is for testing
    return root.records.one({ id: source.id, table:'Voyager.com' })
  },
  fields({ source }){
    return JSON.stringify(source.fields)
  }
}

//export async function parse({ name, value }) { }
