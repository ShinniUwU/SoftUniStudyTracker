import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useResources } from '../context/ResourcesContext'

export const ResourceDetails = () => {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { getResourceById, deleteResource, loading } = useResources()
  const { user, isAuthenticated } = useAuth()

  const resource = resourceId ? getResourceById(resourceId) : undefined
  const canEdit = isAuthenticated && resource && user?.email === resource.ownerEmail

  if (loading && !resource) {
    return (
      <div className="page">
        <div className="card">
          <p>Loading resource…</p>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="page">
        <div className="card">
          <h3>Resource not found</h3>
          <p className="muted">The requested resource does not exist.</p>
          <Link to="/resources" className="ghost-link">
            ← Back to resources
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteResource(resource.id)
    navigate('/resources')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resource</p>
          <h2>{resource.title}</h2>
          <p className="muted">Owner: {resource.ownerEmail || 'unknown'}</p>
        </div>
        <div className="actions-row">
          {canEdit && (
            <>
              <Link to={`/resources/${resource.id}/edit`} className="primary-button">
                Edit
              </Link>
              <button type="button" className="ghost-button" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <p className="eyebrow">Description</p>
        <p>{resource.description}</p>
        <p className="eyebrow" style={{ marginTop: '0.75rem' }}>
          Link
        </p>
        <a href={resource.url} target="_blank" rel="noreferrer" className="ghost-link">
          {resource.url}
        </a>
        <div style={{ marginTop: '0.75rem' }}>
          <Link to="/resources" className="ghost-link">
            ← Back to resources
          </Link>
        </div>
      </div>
    </div>
  )
}
