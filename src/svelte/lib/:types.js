/**
 * @template T
 * @typedef {{[K in keyof T]:T[K]} & {}} Pretty
 */

/**
 * @template T
 * @typedef {[T,false|Error]} Unsafe
 */

/**
 * @typedef {"smaller"|"small"|"large"} Layout
 */

/**
 * @typedef {"button"|"link"|"icon"|"text"} ButtonType
 */

/**
 * @typedef Page
 * @property {number} start
 * @property {number} size
 * @property {function():Page} next
 */

/**
 * @typedef AccessToken
 * @property {string} value
 */

/**
 * @typedef GetPayload
 * @property {string} pathname
 * @property {boolean} [using_cache]
 * @property {Record<string, string>} [headers]
 */

/**
 * @typedef DeletePayload
 * @property {string} pathname
 * @property {Record<string, string>} [headers]
 */

/**
 * @typedef PostPayload
 * @property {string} pathname
 * @property {any} [body]
 * @property {Record<string, string>} [headers]
 */

/**
 * @typedef PutPayload
 * @property {string} pathname
 * @property {any} [body]
 * @property {Record<string, string>} [headers]
 */

/**
 * @typedef {"base"|"information"|"warning"|"error"|"success"} Variant
 */

/**
 * @typedef MessageButton
 * @property {string} label
 * @property {string} icon_path
 * @property {"left"|"right"} icon_position
 * @property {MessageAction} action
 */

/**
 * Close the message when invoked.
 * @callback MessageClose
 */

/**
 * @callback MessageAction
 * @param {MessageActionPayload} payload
 */

/**
 * @typedef MessageActionPayload
 * @property {MessageClose} close invoke this to close the message.
 */

/**
 * @typedef Message
 * @property {string|Array<string|Error>|Error} text
 * @property {number} duration
 * @property {function(MessageActionPayload):void} on_expire
 * @property {Array<MessageButton>} buttons
 * @property {number} priority
 * @property {Variant} variant
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
