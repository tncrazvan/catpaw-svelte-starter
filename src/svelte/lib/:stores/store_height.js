import { readable } from 'svelte/store'

/**
 * @type {HTMLDivElement}
 */
// @ts-ignore
const main = document.getElementById('main')

export const store_height = readable(main.offsetWidth, function start(set) {
  const timer = setInterval(function run() {
    set(main.offsetHeight)
  }, 100)

  return function stop() {
    clearInterval(timer)
  }
})
