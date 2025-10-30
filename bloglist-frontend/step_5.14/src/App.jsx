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

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async credentials => {
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

  const createBlog = async blogObject => {
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
      const response = await blogService.update(id, updatedBlog)
      const updatedBlogs = blogs.map(blog =>
        blog.id === id ? response : blog
      )
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.error('Error updating likes:', error)
      showNotification('Error updating likes', true)
    }
  }

  const handleDelete = async id => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog deleted successfully')
    } catch {
      showNotification('Error deleting blog', true)
    }
  }

  const showNotification = (text, error = false) => {
    setMessage(text)
    setIsError(error)
    setTimeout(() => setMessage(null), 4000)
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} isError={isError} />

      {!user && <LoginForm handleLogin={handleLogin} />}

      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <h3>Create new blog</h3>
          <BlogForm createBlog={createBlog} />

          <h3>Blog List (sorted by likes)</h3>
          {blogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlogLikes={updateBlogLikes}
              handleDelete={handleDelete}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
