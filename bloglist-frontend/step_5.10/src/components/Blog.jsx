
import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    padding: 10,
    border: '1px solid black',
    marginBottom: 5,
  }

  const toggleVisibility = () => setVisible(!visible)

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlogLikes(blog.id, updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name || 'unknown user'}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
