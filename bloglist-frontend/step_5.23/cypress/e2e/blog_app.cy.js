// cypress/e2e/blog_order_by_likes.cy.js
describe('Blogs ordered by likes', function () {
  const apiUrl = 'http://localhost:3003'

  beforeEach(function () {
    // reset backend
    cy.request('POST', `${apiUrl}/api/testing/reset`)

    // create user
    const user = { name: 'Test User', username: 'testuser', password: 'testpassword' }
    cy.request('POST', `${apiUrl}/api/users/`, user)

    // login and save token to localStorage (for frontend to pick up)
    cy.request('POST', `${apiUrl}/api/login`, {
      username: 'testuser',
      password: 'testpassword'
    }).then(({ body }) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
      // set Authorization header for direct API usage
      cy.wrap(body.token).as('token')
    })
  })

  it('blogs are ordered by number of likes (most liked first)', function () {
    // create 3 blogs via API
    cy.get('@token').then(token => {
      const headers = { Authorization: `Bearer ${token}` }

      const blogs = [
        { title: 'First Blog', author: 'A', url: 'http://a.com' },
        { title: 'Second Blog', author: 'B', url: 'http://b.com' },
        { title: 'Third Blog', author: 'C', url: 'http://c.com' }
      ]

      // create blogs and store ids
      const created = []
      cy.wrap(blogs).each((b) => {
        cy.request({
          method: 'POST',
          url: `${apiUrl}/api/blogs`,
          body: b,
          headers
        }).then(res => {
          created.push(res.body)
        })
      }).then(() => {
        // after creation, update likes using API directly:
        // First Blog -> 1 like
        // Second Blog -> 2 likes
        // Third Blog -> 3 likes
        const first = created.find(c => c.title === 'First Blog')
        const second = created.find(c => c.title === 'Second Blog')
        const third = created.find(c => c.title === 'Third Blog')

        // ensure we have ids
        expect(first).to.exist
        expect(second).to.exist
        expect(third).to.exist

        // update likes (use PUT with new likes)
        cy.request({
          method: 'PUT',
          url: `${apiUrl}/api/blogs/${first.id}`,
          body: { ...first, likes: 1, user: first.user?.id || first.user },
          headers
        })
        cy.request({
          method: 'PUT',
          url: `${apiUrl}/api/blogs/${second.id}`,
          body: { ...second, likes: 2, user: second.user?.id || second.user },
          headers
        })
        cy.request({
          method: 'PUT',
          url: `${apiUrl}/api/blogs/${third.id}`,
          body: { ...third, likes: 3, user: third.user?.id || third.user },
          headers
        })
      })
    })

    // now visit the frontend and assert order
    cy.visit('http://localhost:5173')

    // wait for blogs to render
    cy.get('.blog', { timeout: 10000 }).should('have.length.at.least', 3)

    // first should be Third Blog (3 likes)
    cy.get('.blog').eq(0).should('contain', 'Third Blog')
    cy.get('.blog').eq(1).should('contain', 'Second Blog')
    cy.get('.blog').eq(2).should('contain', 'First Blog')
  })
})
