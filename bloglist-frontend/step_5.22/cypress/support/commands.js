Cypress.Commands.add('resetDB', () => {
  cy.request('POST', 'http://localhost:3003/api/testing/reset')
})

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/users', { name, username, password })
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    })
})
