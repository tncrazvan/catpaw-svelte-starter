/**
 *
 * @param {{milliseconds:number}} payload
 * @returns
 */
export function delay({ milliseconds }) {
  return new Promise(function run(resolve) {
    return setTimeout(resolve, milliseconds)
  })
}
