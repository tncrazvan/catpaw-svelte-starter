/**
 *
 * @param {{start?:number, size:number}} payload
 * @returns {Page}
 */
export function page_of({ start = 0, size }) {
  return {
    start,
    size,
    next() {
      return page_of({ start: start + size, size })
    },
  }
}
