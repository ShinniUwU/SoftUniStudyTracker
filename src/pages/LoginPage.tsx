import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCourse } from '../context/CourseContext'

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth()
  const { courseFull } = useCourse()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setError(null)
      login(email, password)
      const redirectTo = (location.state as { from?: string } | undefined)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unable to login. Please try again.')
      }
    }
  }

  return (
    <div className="auth-hero">
      <div className="login-card">
        <p className="eyebrow">SoftUni • {courseFull}</p>
        <h2>Study Tracker</h2>
        <p className="muted">
          Track topic progress, exercises, and exam prep in a SoftUni-inspired UI.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary-button">
            Login
          </button>
          <p className="muted tiny">
            Simple local login only. Data persists in your browser storage.
          </p>
        </form>
      </div>
    </div>
  )
}
