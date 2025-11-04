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

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setTimeout(() => setMessage(null), 3000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.Username.value
    const password = event.target.Password.value
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      event.target.Username.value = ''
      event.target.Password.value = ''
    } catch (exception) {
      setMessage('invalid username or password')
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
      <Notification message={message} />

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
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
