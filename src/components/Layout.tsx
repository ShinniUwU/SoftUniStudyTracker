import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Layout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <p className="brand-overline">SoftUni • ReactJS</p>
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
        </nav>
        <div className="user-meta">
          <div className="user-email">{user?.email}</div>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          ReactJS – October 2025 • Built for SoftUni practice. Stay consistent, ship small wins.
        </p>
      </footer>
    </div>
  )
}
