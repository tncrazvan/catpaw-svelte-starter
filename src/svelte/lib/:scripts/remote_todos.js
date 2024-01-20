import { error } from ':scripts/error'
import { ok } from ':scripts/ok'

/**
 * @returns {Promise<Unsafe<ResponsePage<Todo>>>}
 */
export async function find_all() {
  const response = await fetch('/api/todos')
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`)
  }

  return ok(await response.json())
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function find_one({ id }) {
  const response = await fetch(`/api/todos/${id}`)
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`)
  }

  return ok(await response.json())
}

/**
 * @param {{description:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function add({ description }) {
  const response = await fetch(`/api/todos`, {
    method: 'POST',
    body: description,
    headers: {
      'content-type': 'text/plain',
    },
  })
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`)
  }

  return ok(await response.json())
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<boolean>>}
 */
export async function remove({ id }) {
  const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`)
  }

  return ok(true)
}

/**
 * @param {{id:string}} payload
 * @returns {Promise<Unsafe<ResponseItem<Todo>>>}
 */
export async function toggle({ id }) {
  const response = await fetch(`/api/todos/${id}/toggle`, { method: 'PUT' })
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`)
  }

  return ok(await response.json())
}
