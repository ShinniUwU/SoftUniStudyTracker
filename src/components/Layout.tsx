import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useResources } from '../context/ResourcesContext'
import { useCourse } from '../context/CourseContext'

export const Layout = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { loading: resourcesLoading } = useResources()
  const { courseName, courseFull, courseInitial } = useCourse()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">{courseInitial}</div>
          <div>
            <p className="brand-overline">SoftUni • {courseName}</p>
            <h1 className="brand-title">Study Tracker</h1>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
            Dashboard
          </NavLink>
          <NavLink to="/exam" className={({ isActive }) => (isActive ? 'active' : '')}>
            Exam prep
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => (isActive ? 'active' : '')}>
            Resources
          </NavLink>
        </nav>
        <div className="user-meta">
          <button
            className="ghost-button"
            onClick={toggleTheme}
            type="button"
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <div className="user-email">{user?.email}</div>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>
      {resourcesLoading && <div className="loading-bar" role="status" aria-live="polite" aria-label="Loading resources" />}
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          SoftUni • {courseFull} • Built for SoftUni practice. Stay consistent, ship small wins.
        </p>
      </footer>
    </div>
  )
}
