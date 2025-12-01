import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useResources } from '../context/ResourcesContext'
import { useAuth } from '../context/AuthContext'

export const ResourceEdit = () => {
  const { resourceId } = useParams<{ resourceId: string }>()
  const navigate = useNavigate()
  const { getResourceById, updateResource } = useResources()
  const { user, isAuthenticated } = useAuth()

  const resource = resourceId ? getResourceById(resourceId) : undefined
  const [title, setTitle] = useState(() => resource?.title ?? '')
  const [description, setDescription] = useState(() => resource?.description ?? '')
  const [url, setUrl] = useState(() => resource?.url ?? '')

  if (!resource) {
    return (
      <div className="page">
        <div className="card">
          <h3>Resource not found</h3>
          <Link to="/resources" className="ghost-link">
            ← Back to resources
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = isAuthenticated && user?.email === resource.ownerEmail

  if (!isOwner) {
    return (
      <div className="page">
        <div className="card">
          <h3>You are not allowed to edit this resource.</h3>
          <Link to={`/resources/${resource.id}`} className="ghost-link">
            ← Back to resource
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await updateResource(resource.id, { title, description, url })
    navigate(`/resources/${resource.id}`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Edit</p>
          <h2>Edit resource</h2>
          <p className="muted">Update the resource details.</p>
        </div>
      </div>

      <div className="card">
        <form className="login-form" onSubmit={handleSubmit} key={resource.id}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </label>
          <label>
            URL
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
          </label>
          <div className="actions-row">
            <button type="submit" className="primary-button">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
