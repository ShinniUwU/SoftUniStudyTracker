import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useResources } from '../context/ResourcesContext'
import { useAuth } from '../context/AuthContext'

const truncate = (text: string, length = 140) => {
  if (text.length <= length) return text
  return `${text.slice(0, length).trimEnd()}…`
}

export const ResourcesList = () => {
  const { resources, loading, error } = useResources()
  const { user, isAuthenticated } = useAuth()
  const [showMine, setShowMine] = useState(false)

  const filtered =
    !showMine || !user?.email
      ? resources
      : resources.filter((item) => item.ownerEmail === user.email)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resources</p>
          <h2>Study Resources</h2>
          <p className="muted">
            Curated links and references shared by the community. Browse publicly; contribute when
            logged in.
          </p>
        </div>
        <div className="actions-row">
          {isAuthenticated && (
            <Link to="/resources/create" className="primary-button">
              Create resource
            </Link>
          )}
          {isAuthenticated && (
            <label className="muted tiny" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <input type="checkbox" checked={showMine} onChange={(e) => setShowMine(e.target.checked)} />
              My resources only
            </label>
          )}
        </div>
      </div>

      <div className="card">
        <header className="section-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h3>All resources</h3>
          </div>
          {loading && <p className="muted tiny">Loading resources…</p>}
          {error && <p className="error tiny">{error}</p>}
        </header>

        {filtered.length === 0 && !loading ? (
          <p className="muted">No resources yet. Be the first to add one.</p>
        ) : (
          <div className="topics-grid">
            {filtered.map((resource) => (
              <Link key={resource.id} to={`/resources/${resource.id}`} className="topic-card">
                <div className="topic-header">
                  <h4>{resource.title}</h4>
                  <span className="progress-chip">Resource</span>
                </div>
                <p className="muted">{truncate(resource.description)}</p>
                <div className="topic-footer">
                  <span className="status-dot" data-state="progress" />
                  <p className="muted tiny">by {resource.ownerEmail || 'unknown'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
