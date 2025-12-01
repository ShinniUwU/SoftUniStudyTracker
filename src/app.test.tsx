import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { StudyProvider } from './context/StudyContext'
import { ThemeProvider } from './context/ThemeContext'
import { ResourcesProvider } from './context/ResourcesContext'
import { CourseProvider } from './context/CourseContext'

const renderApp = (initialEntries: string[] = ['/login']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <AuthProvider>
          <CourseProvider>
            <StudyProvider>
              <ResourcesProvider>
                <App />
              </ResourcesProvider>
            </StudyProvider>
          </CourseProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  )

describe('SoftUni Study Tracker', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      ),
    )
    localStorage.clear()
  })

  it('logs in successfully and shows dashboard', async () => {
    renderApp()

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'student@softuni.bg' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/SoftUni Study Tracker/i)).toBeInTheDocument()
  })

  it('toggles checklist item and adds a new task on exam prep page', async () => {
    localStorage.setItem('study-tracker-auth', JSON.stringify({ email: 'test@example.com' }))
    renderApp(['/exam'])

    const checkboxes = await screen.findAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()

    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()

    fireEvent.change(screen.getByPlaceholderText(/prep task/i), {
      target: { value: 'Practice hooks' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(await screen.findByText(/practice hooks/i)).toBeInTheDocument()
  })
})
