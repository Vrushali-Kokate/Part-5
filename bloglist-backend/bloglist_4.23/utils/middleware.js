const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
// Extract token from the Authorization header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

// Extract user info based on token
const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id)
      }
    } catch (error) {
      request.user = null
    }
  } else {
    request.user = null
  }
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
