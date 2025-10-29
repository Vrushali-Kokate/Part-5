import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/blogs`

let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const create = async (newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// ✅ NEW — Update blog (for likes)
export const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

export default { getAll, create, update, setToken }
