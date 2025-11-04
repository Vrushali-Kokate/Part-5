describe('Blog app', function () {
  beforeEach(function () {
    // Reset backend and create one user
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testuser',
        password: 'secret'
      }).then(({ body }) => {
        localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
        cy.visit('http://localhost:5173')
      })
    })

    it('A blog can be created', function () {
      // Open form
      cy.contains('create new blog').click()

      // Fill out the blog form
      cy.get('#title-input').type('E2E Created Blog')
      cy.get('#author-input').type('Cypress Tester')
      cy.get('#url-input').type('https://example.com/cypress')
      cy.get('#create-button').click()

      // Assert that the blog appears in the list
      cy.contains('E2E Created Blog')
      cy.contains('Cypress Tester')
    })
  })
})
