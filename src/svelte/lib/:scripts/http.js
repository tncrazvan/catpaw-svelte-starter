import { error } from ':scripts/error'
import { ok } from ':scripts/ok'
import { store_token } from ':stores/store_token'
import { store_cache_touches } from ':stores/store_cache_touches'
import { get } from 'svelte/store'
import { CACHE_LIFETIME } from ':constants'
import { delay } from ':scripts/delay'
import { find_table } from ':scripts/db'
import { send_message } from ':scripts/send_message'

/**
 * @type {Record<string,boolean>}
 */
const uncacheable = {}

const ROOT = '/api'
/**
 * @type {Set<string>}
 */
const CURRENTLY_VISITING = new Set()

/**
 * @type {Record<string, number>}
 */
let $store_cache_touches = {}
store_cache_touches.subscribe(function watch(value) {
  return ($store_cache_touches = value)
})

/**
 *
 * @param {{pathname:string}} payload
 */
export function set_uncachable({ pathname }) {
  uncacheable[pathname] = true
}

export const http = {
  /**
   * Request a resource.
   *
   *
   * > **Note**\
   * > Resources are cached in IndexedDB.
   *
   * > **Note**\
   * > This method will invalidate specific cache entries automatically whenever it detects an entry older than 10 seconds in production.
   * @template [T =  any]
   * @param {GetPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async get({ pathname, headers = {}, using_cache = true }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 })
    }

    CURRENTLY_VISITING.add(pathname)

    const NOW = Date.now()
    const LAST_TOUCH = $store_cache_touches[pathname]
    const [CACHED, CACHE_ERROR] = (await cache_get({ pathname })) ?? false

    if (CACHE_ERROR) {
      CURRENTLY_VISITING.delete(pathname)
      return error(CACHE_ERROR)
    }

    if (using_cache && CACHED && LAST_TOUCH) {
      const DELTA = NOW - LAST_TOUCH
      if (DELTA < CACHE_LIFETIME) {
        console.info(
          `%c cache hit ${pathname}`,
          'background: #222; color: #bada55',
        )
        CURRENTLY_VISITING.delete(pathname)
        return ok(CACHED)
      }
    }

    if (!pathname.startsWith('/')) {
      CURRENTLY_VISITING.delete(pathname)
      return error("path must start with '/'.")
    }

    try {
      const error_on_missing_token = !!uncacheable[pathname]

      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token,
      })

      if (e) {
        CURRENTLY_VISITING.delete(pathname)
        return error(e)
      }

      const response = await fetch(`${ROOT}${pathname}`, {
        headers: {
          ...headers,
          ...missing_headers,
        },
      })

      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname)
        return error(`Request failed with status ${response.status}.`)
      }

      let result = await response.json()

      if (using_cache) {
        const [, SET_ERROR] = await cache_set({ pathname, value: result })
        if (SET_ERROR) {
          CURRENTLY_VISITING.delete(pathname)
          return error(SET_ERROR)
        }
        $store_cache_touches[pathname] = Date.now()
        store_cache_touches.set($store_cache_touches)
      }

      CURRENTLY_VISITING.delete(pathname)

      return ok(result)
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname)
      return error(e)
    }
  },

  /**
   * Send a delete request.
   * @template [T =  any]
   * @param {DeletePayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async delete({ pathname, headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 })
    }

    if (!pathname.startsWith('/')) {
      CURRENTLY_VISITING.delete(pathname)
      return error("path must start with '/'.")
    }

    try {
      const error_on_missing_token = !!uncacheable[pathname]
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token,
      })

      if (e) {
        CURRENTLY_VISITING.delete(pathname)
        return error(e)
      }

      CURRENTLY_VISITING.add(pathname)

      const response = await fetch(`${ROOT}${pathname}`, {
        method: 'DELETE',
        headers: {
          ...headers,
          ...missing_headers,
        },
      })

      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname)
        return error(`Request failed with status ${response.status}.`)
      }

      const result = await response.json()

      CURRENTLY_VISITING.delete(pathname)

      return ok(result)
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname)
      return error(e)
    }
  },

  /**
   * Send a resource.
   * @template [T = any]
   * @param {PostPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async post({ pathname, body = '', headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 })
    }

    if (!pathname.startsWith('/')) {
      CURRENTLY_VISITING.delete(pathname)
      return error("path must start with '/'.")
    }

    try {
      const error_on_missing_token = !!uncacheable[pathname]
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token,
      })

      if (e) {
        CURRENTLY_VISITING.delete(pathname)
        return error(e)
      }

      CURRENTLY_VISITING.add(pathname)

      const response = await fetch(`${ROOT}${pathname}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...headers,
          ...missing_headers,
        },
        body: body,
      })

      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname)
        return error(`Request failed with status ${response.status}.`)
      }

      const result = await response.json()

      CURRENTLY_VISITING.delete(pathname)

      return ok(result)
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname)
      return error(e)
    }
  },

  /**
   * Update an existing resource.
   * @template [T =  any]
   * @param {PutPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async put({ pathname, body = '', headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 })
    }

    if (!pathname.startsWith('/')) {
      CURRENTLY_VISITING.delete(pathname)
      return error("path must start with '/'.")
    }

    try {
      const error_on_missing_token = !!uncacheable[pathname]
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token,
      })

      if (e) {
        CURRENTLY_VISITING.delete(pathname)
        return error(e)
      }

      const response = await fetch(`${ROOT}${pathname}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          ...headers,
          ...missing_headers,
        },
        body: body,
      })

      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname)
        return error(`Request failed with status ${response.status}.`)
      }

      return ok(await response.json())
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname)
      return error(e)
    }
  },
  /**
   * Invalidate all cache.\
   * This will delete all IndexedDB databases.
   * @returns {Promise<void>}
   */
  async invalidate() {
    const delete_requests = []

    const databases = await indexedDB.databases()
    for (const database of databases) {
      if (!database.name) {
        continue
      }
      const delete_request = indexedDB.deleteDatabase(database.name)
      delete_requests.push(
        new Promise(function run(resolve) {
          delete_request.addEventListener('blocked', resolve)
          delete_request.addEventListener('error', resolve)
          delete_request.addEventListener('success', resolve)
          delete_request.addEventListener('upgradeneeded', resolve)
        }),
      )
    }

    await Promise.all(delete_requests)

    const cache_keys = await caches.keys()

    const promises_cache_delete = []

    for (const cache_key of cache_keys) {
      promises_cache_delete.push(caches.delete(cache_key))
    }

    await Promise.all(promises_cache_delete)

    notify()

    store_cache_touches.set({})
  },
}

function notify() {
  send_message({
    text: `Your http cache has just been invalidated.`,
    buttons: [
      {
        label: 'Close',
        action: function run({ close }) {
          close()
        },
        icon_path: '',
        icon_position: 'left',
      },
    ],
    duration: 10000,
    variant: 'information',
  })
}

/**
 * @param {{headers:Record<string, string>, error_on_missing_token:boolean}} payload
 * @returns {Unsafe<Record<string,string>>}
 */
function find_missing_headers({ headers, error_on_missing_token = true }) {
  const hasAuthorization = !!Object.keys(headers).find(function pass(key) {
    return key.trim() === 'authorization'
  })

  /**
   * @type {typeof headers}
   */
  const missing_headers = {}

  if (!hasAuthorization) {
    const token = get(store_token)
    if (!token) {
      if (!error_on_missing_token) {
        return ok(missing_headers)
      }
      return error('token not found.')
    }
    missing_headers['authorization'] = `Bearer ${token.value}`
  }

  return ok(missing_headers)
}

/**
 * Get a cache entry.
 * @template T
 * @param {{pathname:string}} payload
 * @returns {Promise<Unsafe<T>>}
 */
async function cache_get({ pathname }) {
  const table = find_table({ table_name: 'cache' }) ?? false
  if (!table) {
    return error('Could not find cache table.')
  }
  const result = await table.get(pathname)
  return ok(result?.value ?? false)
}

/**
 * Set a cache entry.
 * @template T
 * @param {{pathname:string, value:T}} payload
 * @returns {Promise<Unsafe<void>>}
 */
async function cache_set({ pathname, value }) {
  const table = find_table({ table_name: 'cache' }) ?? false
  if (!table) {
    return error('Could not find cache table.')
  }
  return ok(await table.put({ pathname, value }))
}

/**
 * Clear all cache.
 * @returns {Promise<Unsafe<void>>}
 */
async function cache_reset() {
  const table = find_table({ table_name: 'cache' }) ?? false
  if (!table) {
    return error('Could not find cache table.')
  }
  return ok(await table?.clear())
}
