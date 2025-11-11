// src/components/Blog.jsx
import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, handleDelete, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => setShowDetails(!showDetails)

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: (blog.likes || 0) + 1,
        user: blog.user?.id || blog.user
      }
      await updateBlogLikes(blog.id, updatedBlog)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleDelete(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <p>{blog.url}</p>

          <p data-cy="likes-section">
            likes {blog.likes || 0}{' '}
            <button onClick={handleLike}>like</button>
          </p>

          <p>{blog.user?.name || 'unknown user'}</p>

          {currentUser?.username === blog.user?.username && (
            <button onClick={remove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
