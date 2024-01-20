import { http } from './http'

/**
 * @returns {Promise<Unsafe<ResponsePage<Todo>>>}
 */
export async function find_all() {
  return http.get({ pathname: '/todos', using_cache:false })
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function find_one({ id }) {
  return http.get({ pathname: `/todos/${id}`, using_cache:false })
}

/**
 * @param {{description:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function add({ description }) {
  return http.post({
    pathname: `/todos`,
    body: description,
    headers: {
      'content-type': 'text/plain',
    },
  })
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<boolean>>}
 */
export async function remove({ id }) {
  return http.delete({ pathname: `/todos/${id}` })
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function toggle({ id }) {
  return http.put({ pathname: `/todos/${id}/toggle` })
}
