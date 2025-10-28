const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('unique')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('creation fails if username is missing', async () => {
  const newUser = { name: 'No Username', password: '1234' }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('required')
})

test('creation fails if password is missing', async () => {
  const newUser = { username: 'nouser', name: 'No Pass' }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('required')
})

test('creation fails if username too short', async () => {
  const newUser = { username: 'ab', name: 'Short Name', password: '12345' }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('at least 3 characters')
})

test('creation fails if password too short', async () => {
  const newUser = { username: 'validuser', name: 'Short Pass', password: '12' }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('at least 3 characters')
})

afterAll(async () => {
  await mongoose.connection.close()
})
