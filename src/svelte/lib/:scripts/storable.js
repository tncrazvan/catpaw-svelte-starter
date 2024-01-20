/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { writable } from 'svelte/store'

/**
 * Create a store and sync it with `localStorage`.
 * @template T
 * @param {StorablePayload<T>} payload
 * @returns {import('svelte/store').Writable<T>}
 */
export function storable({
  name,
  default_value,
  serialize = function convert(x) {
    return JSON.stringify(x)
  },
  deserialize = function convert(x) {
    return JSON.parse(x)
  },
}) {
  const key = `storable_${name}`

  if (localStorage[key]) {
    try {
      default_value = deserialize(localStorage[key])
    } catch (e) {
      console.warn(e)
    }
  }

  const result = writable(default_value)
  result.subscribe(function watch($result) {
    localStorage.setItem(key, serialize($result))
  })
  return result
}
