import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Blog from '../components/Blog'

describe('Blog component', () => {
  const blog = {
    title: 'React Testing Made Easy',
    author: 'Vrushali Kokate',
    url: 'https://react.dev',
    likes: 5,
    user: { name: 'Sumit' },
  }

  it('renders title and author by default, but not url or likes', () => {
    render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} />)

    // ✅ Use a flexible text matcher (regex)
    expect(screen.getByText(/React Testing Made Easy/i)).toBeVisible()
    expect(screen.getByText(/Vrushali Kokate/i)).toBeVisible()

    // Should NOT show url or likes initially
    const url = screen.queryByText('https://react.dev')
    const likes = screen.queryByText(/likes/i)

    expect(url).toBeNull()
    expect(likes).toBeNull()
  })
})
