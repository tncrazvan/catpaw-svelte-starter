import { message } from ':stores/store_message'

/**
 * Send a message to the screen.
 * @param {{text:string, variant:Variant, duration:number, buttons:Array<MessageButton>}} payload
 */
export function send_message({ text, variant, duration, buttons }) {
  message.set({
    buttons,
    duration,
    variant,
    on_expire: function run({ close }) {
      close()
    },
    priority: 1,
    text,
  })
}

/**
 * Send an information message to the screen.
 * @param {{text:string}} payload
 */
export function send_information({ text }) {
  send_message({
    text,
    variant: 'information',
    duration: 15_000,
    buttons: [
      {
        label: 'Close',
        icon_path: '',
        icon_position: 'left',
        action: function run() {
          message.set(false)
        },
      },
    ],
  })
}

/**
 * Send an error message to the screen.
 * @param {{text:string}} payload
 */
export function send_error({ text }) {
  send_message({
    text,
    variant: 'error',
    duration: 15_000,
    buttons: [
      {
        label: 'Close',
        icon_path: '',
        icon_position: 'left',
        action: function run() {
          message.set(false)
        },
      },
    ],
  })
}

/**
 * Send a warning message to the screen.
 * @param {{text:string}} payload
 */
export function send_warning({ text }) {
  send_message({
    text,
    variant: 'warning',
    duration: 15_000,
    buttons: [
      {
        label: 'Close',
        icon_path: '',
        icon_position: 'left',
        action: function run() {
          message.set(false)
        },
      },
    ],
  })
}
