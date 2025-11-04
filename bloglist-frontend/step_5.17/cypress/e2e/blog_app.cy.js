describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login to application')
    cy.get('input[name="Username"]')
    cy.get('input[name="Password"]')
    cy.get('#login-button').should('contain', 'login')
  })
})
