
import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/blogs`

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export default { getAll, create, setToken }
