// src/services/blogs.js
import axios from 'axios'

// Make sure this URL points to your backend
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null
const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return Array.isArray(res.data) ? res.data : []
}

const create = async (blog) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.post(baseUrl, blog, config)
  return res.data
}

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return res.data
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default { getAll, create, update, remove, setToken }
