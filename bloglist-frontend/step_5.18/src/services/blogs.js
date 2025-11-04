import axios from 'axios'

// ✅ Make sure this port matches backend
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  // ✅ id must be a string, not an object
  if (typeof id !== 'string') {
    console.error('Invalid blog id for update:', id)
    throw new Error('Blog id must be a string')
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  if (typeof id !== 'string') {
    console.error('Invalid blog id for delete:', id)
    throw new Error('Blog id must be a string')
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }
