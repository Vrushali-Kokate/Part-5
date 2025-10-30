import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import Blog from '../components/Blog'

describe('Blog component', () => {
  const blog = {
    title: 'React Testing Made Easy',
    author: 'Vrushali Kokate',
    url: 'https://example.com/testing',
    likes: 5,
    user: { username: 'tester', name: 'Test User' },
  }

  it('renders title and author by default, but not url or likes', () => {
    render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} />)

    // Shows title and author
    expect(screen.getByText(/React Testing Made Easy/)).toBeVisible()
    expect(screen.getByText(/Vrushali Kokate/)).toBeVisible()

    // Does NOT show url or likes initially
    expect(screen.queryByText(/https:\/\/example.com/)).toBeNull()
    expect(screen.queryByText(/likes 5/)).toBeNull()
  })

  it('shows url and likes when the view button is clicked', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} />)

    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://example.com/testing')).toBeVisible()
    expect(screen.getByText(/likes 5/)).toBeVisible()
  })

  it('calls the like event handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    const mockUpdateHandler = vi.fn()

    render(<Blog blog={blog} updateBlogLikes={mockUpdateHandler} deleteBlog={() => {}} />)

    // Reveal the like button
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Click "like" twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Check handler called twice
    expect(mockUpdateHandler).toHaveBeenCalledTimes(2)
  })
})
