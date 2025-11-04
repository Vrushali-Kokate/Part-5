import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import BlogForm from '../components/BlogForm'

describe('BlogForm component', () => {
  it('calls the event handler with correct details when new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    // Select input fields
    const titleInput = screen.getByPlaceholderText('enter title')
    const authorInput = screen.getByPlaceholderText('enter author')
    const urlInput = screen.getByPlaceholderText('enter url')
    const createButton = screen.getByText('create')

    // Simulate user typing
    await user.type(titleInput, 'Testing React Forms')
    await user.type(authorInput, 'Vrushali Kokate')
    await user.type(urlInput, 'https://example.com/test')

    // Simulate form submission
    await user.click(createButton)

    // Expect handler called once
    expect(createBlog).toHaveBeenCalledTimes(1)

    // Expect handler called with correct blog object
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React Forms',
      author: 'Vrushali Kokate',
      url: 'https://example.com/test'
    })
  })
})
