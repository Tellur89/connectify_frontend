import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import axios from 'axios'
import SignupUser from '.'
import { MemoryRouter } from 'react-router-dom'

describe('SignupUser page', () => {
  test('renders the SignupUser component', () => {
    render(
      <MemoryRouter>
        <SignupUser />
      </MemoryRouter>
    )

    expect(screen.getByLabelText('Username:')).toBeDefined()
    expect(screen.getByLabelText('Email:')).toBeDefined()
    expect(screen.getByLabelText('Password:')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Register' })).toBeDefined()
  })

  test('submits the form with correct credentials', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 200,
      data: { message: 'User registered successfully' },
    })

    render(
      <MemoryRouter>
        <SignupUser />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    })

    fireEvent.click(screen.getAllByRole('button', { name: 'Register' })[0])

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))

    expect(
      screen.getByRole('heading', { name: 'Correct Credentials' })
    ).toBeDefined()
  })

  test('submits the form with incorrect credentials', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      status: 400,
      data: { message: 'Invalid credentials' },
    })

    render(
      <MemoryRouter>
        <SignupUser />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    })

    fireEvent.click(screen.getAllByRole('button', { name: 'Register' })[0])

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))

    expect(
      screen.getByRole('heading', { name: 'Incorrect Credentials' })
    ).toBeDefined()
  })

  test('handles error in form submission', async () => {
    const errorMessage = 'Error occurred during registration'
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation()
    vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error(errorMessage))

    render(
      <MemoryRouter>
        <SignupUser />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText('Email:'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'testpassword' },
    })

    fireEvent.click(screen.getAllByRole('button', { name: 'Register' })[0])

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))

    consoleErrorSpy.mockRestore()
  })
})