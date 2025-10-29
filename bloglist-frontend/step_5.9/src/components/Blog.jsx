import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible(!visible)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogUserName = blog.user && blog.user.name
    ? blog.user.name
    : 'unknown user'

  return (
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '5px' }}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>

      <div style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a><br />
        likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button><br />
        {blogUserName}<br />
        {user && blog.user && user.username === blog.user.username && (
          <button onClick={() => handleDelete(blog.id)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
