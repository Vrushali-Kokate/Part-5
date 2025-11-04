// import { useState } from 'react'

// const LoginForm = ({ handleLogin }) => {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')

//   const onSubmit = (event) => {
//     event.preventDefault()
//     handleLogin({ username, password })
//     setUsername('')
//     setPassword('')
//   }

//   return (
//     <form onSubmit={onSubmit}>
//       <div>
//         username
//         <input value={username} onChange={({ target }) => setUsername(target.value)} />
//       </div>
//       <div>
//         password
//         <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
//       </div>
//       <button type="submit">login</button>
//     </form>
//   )
// }

// export default LoginForm


// src/components/LoginForm.jsx
import React from 'react'

const LoginForm = ({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              name="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              name="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
