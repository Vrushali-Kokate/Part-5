import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`Welcome back, ${user.name || user.username}!`)
      setMessageType('success')
      setTimeout(() => setMessage(null), 4000)
    } catch (error) {
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => setMessage(null), 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setMessageType('success')
      setTimeout(() => setMessage(null), 4000)
    } catch (error) {
      setMessage('failed to add blog')
      setMessageType('error')
      setTimeout(() => setMessage(null), 4000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} type={messageType} />

      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <p>{user.name || user.username} logged in <button onClick={handleLogout}>logout</button></p>

          <h2>create new</h2>
          <BlogForm createBlog={addBlog} />

          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
