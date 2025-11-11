describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('a blog can be liked', function () {
    // login
    cy.get('input[name="Username"]').type('testuser')
    cy.get('input[name="Password"]').type('testpassword')
    cy.contains('login').click()

    // create blog
    cy.contains('create new blog').click()
    cy.get('#title-input').type('Like Test Blog')
    cy.get('#author-input').type('Tester')
    cy.get('#url-input').type('http://liketest.com')
    cy.get('#create-button').click()

    // ✅ wait for blog to appear, then alias it
    cy.contains('Like Test Blog Tester')
      .parent()
      .as('theBlog')

    // expand details
    cy.get('@theBlog').contains('view').click()

    

    // like and verify likes increased
    cy.get('@theBlog').within(() => {
      cy.get('[data-cy="likes-section"]').should('contain', 'likes 0')
      cy.contains('like').click()
      cy.get('[data-cy="likes-section"]').should('contain', 'likes 1')
    })

     // check that remove button is visible (only for creator)
  cy.get('@theBlog').contains('remove').should('be.visible')

  // click remove and confirm deletion
  cy.on('window:confirm', () => true) // automatically click "OK"
  cy.get('@theBlog').contains('remove').click()

  // confirm the blog is gone
  cy.contains('Deletable Blog Tester').should('not.exist')
})
  })


