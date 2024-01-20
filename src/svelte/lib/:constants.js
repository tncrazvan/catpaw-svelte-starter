import { ok } from ':scripts/ok'

export const PROMISE_INFINITE = new Promise(function run() {
  return true
})
/**
 * @type {Promise<void>}
 */
export const PROMISE_EMPTY = new Promise(function run(resolve) {
  resolve()
})
/**
 * @type {Promise<Array<any>>}
 */
export const PROMISE_EMPTY_ARRAY = new Promise(function run(resolve) {
  resolve([])
})
/**
 * @type {Promise<Unsafe<any>>}
 */
export const PROMISE_EMPTY_UNSAFE = new Promise(function run(resolve) {
  resolve(ok(true))
})
export const IS_DEV = '80' !== location.port && '443' !== location.port

// with this configuration cache will invalidate every 1 hour in production
export const CACHE_LIFETIME = IS_DEV ? 10_000_000_000 : 1000 * 10
