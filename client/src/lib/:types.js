/**
 * @template T
 * @typedef {{[K in keyof T]:T[K]} & {}} Pretty
 */

/**
 * @template T
 * @typedef {[T,false|Error]} Unsafe
 */

/**
 * @typedef Page
 * @property {number} start
 * @property {number} size
 */

/**
 * @template T
 * @typedef ResponseItem
 * @property {"item"} type
 * @property {T} data
 * @property {string} message
 * @property {number} status
 */

/**
 * @template T
 * @typedef ResponsePage
 * @property {"page"} type
 * @property {Array<T>} data
 * @property {string} message
 * @property {number} status
 * @property {string} previousHref
 * @property {string} nextHref
 * @property {Page} previous
 * @property {Page} next
 */

/**
 * @typedef Todo
 * @property {string} id
 * @property {string} description
 * @property {boolean} checked
 */
