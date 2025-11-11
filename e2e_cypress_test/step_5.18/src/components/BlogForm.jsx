import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:{' '}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="enter title"
        />
      </div>

      <div>
        author:{' '}
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="enter author"
        />
      </div>

      <div>
        url:{' '}
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="enter url"
        />
      </div>

      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
