import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { StudyProvider } from './context/StudyContext'

const renderApp = (initialEntries: string[] = ['/login']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <StudyProvider>
          <App />
        </StudyProvider>
      </AuthProvider>
    </MemoryRouter>,
  )

describe('ReactJS Study Tracker', () => {
  beforeEach(() => {
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

    expect(await screen.findByText(/ReactJS Study Tracker/i)).toBeInTheDocument()
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
