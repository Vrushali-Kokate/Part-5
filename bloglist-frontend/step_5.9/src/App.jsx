import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  // fetch blogs only if logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  // check if user already logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify('Login successful')
    } catch (exception) {
      notify('Wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    notify('Logged out successfully')
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      notify(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
    } catch (exception) {
      notify('Failed to add blog')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user, // user can be id or object
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      // Fix: keep the old user object to prevent losing user.name
      setBlogs(blogs.map(b =>
        b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }
      ))
    } catch (error) {
      notify('Failed to update likes')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog?')) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        notify('Blog deleted successfully')
      } catch (error) {
        notify('Failed to delete blog')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <BlogForm createBlog={addBlog} />
      <br />
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        )}
    </div>
  )
}

export default App
