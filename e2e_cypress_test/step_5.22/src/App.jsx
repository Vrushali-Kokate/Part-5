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

  // Fetch all blogs initially
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  // Load logged user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Create a new blog
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
      setMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setIsError(false)
      setTimeout(() => setMessage(null), 3000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error(error)
      setMessage('Error adding blog')
      setIsError(true)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // ✅ Update blog likes (with functional setState)
  const updateBlogLikes = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(prevBlogs =>
        prevBlogs
          .map(b =>
            b.id === id
              ? { ...returnedBlog, user: b.user } // preserve user info
              : b
          )
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  // Delete a blog
  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  // Handle login
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
      setMessage(`Welcome, ${user.name}`)
      setIsError(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (exception) {
      setMessage('invalid username or password')
      setIsError(true)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Handle logout
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
