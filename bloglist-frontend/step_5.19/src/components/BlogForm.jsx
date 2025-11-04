import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={handleSubmit}>
        <div>
          title: <input id="title-input" value={title} onChange={({ target }) => setTitle(target.value)} placeholder="enter title" />
        </div>
        <div>
          author: <input id="author-input" value={author} onChange={({ target }) => setAuthor(target.value)} placeholder="enter author" />
        </div>
        <div>
          url: <input id="url-input" value={url} onChange={({ target }) => setUrl(target.value)} placeholder="enter url" />
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
