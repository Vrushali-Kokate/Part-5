describe('Blog app', function () {

  beforeEach(function () {
    // 1️⃣ Reset the backend test DB
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    // 2️⃣ Create a test user
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    // 3️⃣ Open the app
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {

    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('secret')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('wrongpass')
      cy.get('#login-button').click()

      // Expect red error
      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      // Should NOT show logged-in message
      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })
})
