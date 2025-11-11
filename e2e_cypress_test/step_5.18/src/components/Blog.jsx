import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, handleDelete, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user, // ensure backend gets user id
      }
      await updateBlogLikes(blog.id, updatedBlog)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const deleteBlog = async () => {
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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user?.name || 'unknown user'}</p>

          {/* Show delete only if current user owns it */}
          {currentUser?.username === blog.user?.username && (
            <button onClick={deleteBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
