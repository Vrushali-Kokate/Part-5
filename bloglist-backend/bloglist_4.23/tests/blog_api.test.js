const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a test user
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
  await user.save()

  // Log in to get the token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password' })

  token = loginResponse.body.token

  // Add one blog
  const blog = new Blog({
    title: 'First Blog',
    author: 'Author Name',
    url: 'http://example.com',
    likes: 10,
    user: user.id,
  })

  await blog.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added with a token', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(2)
})

test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'No Token Blog',
    author: 'Anonymous',
    url: 'http://notoken.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})
