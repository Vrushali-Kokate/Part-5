// src/App.jsx
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll()
      .then(list => {
        const arr = Array.isArray(list) ? list : []
        setBlogs(arr.sort((a, b) => (b.likes || 0) - (a.likes || 0)))
      })
      .catch(err => {
        console.error('Error fetching blogs', err)
        setBlogs([])
      })
  }, [])

  useEffect(() => {
    const loggedJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedJSON) {
      const u = JSON.parse(loggedJSON)
      setUser(u)
      blogService.setToken(u.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      setBlogs(prev => [...prev, created].sort((a, b) => (b.likes || 0) - (a.likes || 0)))
      setMessage(`a new blog "${created.title}" by ${created.author} added`)
      setIsError(false)
      setTimeout(() => setMessage(null), 3000)
      blogFormRef.current.toggleVisibility()
    } catch (err) {
      console.error('Error creating blog', err)
      setMessage('error creating blog')
      setIsError(true)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const updateBlogLikes = async (id, updatedBlog) => {
    try {
      const returned = await blogService.update(id, updatedBlog)
      setBlogs(prev =>
        prev.map(b => (b.id === id ? { ...b, likes: returned.likes } : b))
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      )
    } catch (err) {
      console.error('Error updating likes', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      console.error('Error deleting', err)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.Username.value
    const password = event.target.Password.value
    try {
      const u = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(u))
      blogService.setToken(u.token)
      setUser(u)
      event.target.Username.value = ''
      event.target.Password.value = ''
      setMessage(`Welcome, ${u.name}`)
      setIsError(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage('invalid username or password')
      setIsError(true)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} isError={isError} />

      {!user && (
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <div>
            username:
            <input name="Username" />
          </div>
          <div>
            password:
            <input type="password" name="Password" />
          </div>
          <button type="submit">login</button>
        </form>
      )}

      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <h3>Blog List (sorted by likes)</h3>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlogLikes={updateBlogLikes}
              handleDelete={handleDelete}
              currentUser={user}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
