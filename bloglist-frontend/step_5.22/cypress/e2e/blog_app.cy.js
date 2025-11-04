it('only the creator of a blog can see its delete button', function () {
  // --- Create first user and log in ---
  const user1 = {
    name: 'User One',
    username: 'user1',
    password: 'password1'
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user1)

  cy.request('POST', 'http://localhost:3003/api/login', {
    username: 'user1',
    password: 'password1'
  }).then(({ body }) => {
    // store token and login locally
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')

    // create a blog
    cy.contains('create new blog').click()
    cy.get('#title-input').type('Private Blog')
    cy.get('#author-input').type('Author1')
    cy.get('#url-input').type('http://privateblog.com')
    cy.get('#create-button').click()
  })

  // --- Logout user1 ---
  cy.contains('logout').click()

  // --- Create a second user ---
  const user2 = {
    name: 'User Two',
    username: 'user2',
    password: 'password2'
  }
  cy.request('POST', 'http://localhost:3003/api/users/', user2)

  // --- Login as user2 ---
  cy.get('input[name="Username"]').type('user2')
  cy.get('input[name="Password"]').type('password2')
  cy.contains('login').click()

  // --- Expand blog details ---
  cy.contains('Private Blog Author1')
    .parent()
    .as('theBlog')

  cy.get('@theBlog').contains('view').click()

  // --- Verify that remove button is not visible ---
  cy.get('@theBlog').contains('remove').should('not.exist')
})
