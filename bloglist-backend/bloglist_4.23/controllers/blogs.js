const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// POST new blog (requires valid token)
blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
const savedBlog = await blog.save()
const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
response.status(201).json(populatedBlog)

})

// DELETE a blog (only creator can delete)
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only creator can delete this blog' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// PUT (optional: update likes)
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    body,
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 }) // ✅ key fix!

  response.json(updatedBlog)
})


module.exports = blogsRouter
