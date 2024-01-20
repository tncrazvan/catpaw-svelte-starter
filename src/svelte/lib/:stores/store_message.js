import { writable } from 'svelte/store'

function close() {
  message.set(false)
}

function create_message_listener() {
  /**
   * @type {import("svelte/store").Writable<false|Message>}
   */
  const message = writable(false)

  /**
   * @type {false|NodeJS.Timeout}
   */
  let timeout = false

  message.subscribe(function watch($message) {
    if (!$message) {
      return
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function run() {
      if ($message.on_expire) {
        $message.on_expire({ close })
      }
      timeout = false
    }, $message.duration)
  })

  return message
}

export const message = create_message_listener()
