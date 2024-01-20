import Dexie from 'dexie'

const db = new Dexie('database')
db.version(1).stores({
  cache: '&pathname, value',
})

/**
 *
 * @param {{table_name:string}} payload
 */
export function find_table({ table_name }) {
  return db.tables.find(function pass(table) {
    return table.name === table_name
  })
}
