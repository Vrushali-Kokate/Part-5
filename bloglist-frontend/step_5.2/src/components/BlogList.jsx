import Blog from './Blog'

function BlogList({ blogs }) {
  return (
    <div>
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList
