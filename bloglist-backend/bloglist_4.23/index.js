const app = require('./app')
const http = require('http')
const config = require('./utils/config')
require('dotenv').config()

const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
