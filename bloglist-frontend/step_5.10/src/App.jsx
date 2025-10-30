import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  // ✅ Fetch blogs only when user is logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => {
        // ✅ Sort blogs by likes (descending)
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      })
    }
  }, [user])

  // ✅ Restore logged-in user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, error = false) => {
    setMessage(text)
    setIsError(error)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}`)
    } catch {
      showNotification('Wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setBlogs([])
    showNotification('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
      showNotification(`A new blog "${newBlog.title}" added`)
    } catch {
      showNotification('Error adding blog', true)
    }
  }

  const updateBlogLikes = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(
        blogs
          .map((blog) => (blog.id === id ? returnedBlog : blog))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      showNotification('Error updating likes', true)
    }
  }

  return (
    <div>
      <h2>Blog List (sorted by likes)</h2>
      <Notification message={message} isError={isError} />

      {!user ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <h3>Create new blog</h3>
          <BlogForm createBlog={createBlog} />

          <h3>Blogs</h3>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlogLikes={updateBlogLikes}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
