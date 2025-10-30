import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

    expect(screen.getByText(/React Testing Made Easy/i)).toBeVisible()
    expect(screen.getByText(/Vrushali Kokate/i)).toBeVisible()
    expect(screen.queryByText('https://react.dev')).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  it('shows url and likes when the view button is clicked', async () => {
    render(<Blog blog={blog} updateBlogLikes={() => {}} deleteBlog={() => {}} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    expect(screen.getByText('https://react.dev')).toBeVisible()
    expect(screen.getByText(/likes 5/i)).toBeVisible()
  })
})
