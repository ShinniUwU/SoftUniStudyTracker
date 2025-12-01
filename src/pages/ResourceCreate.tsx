import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResources } from '../context/ResourcesContext'
import { useAuth } from '../context/AuthContext'

export const ResourceCreate = () => {
  const { createResource } = useResources()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await createResource({ title, description, url })
    navigate('/resources')
  }

  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="card">
          <h3>Login required</h3>
          <p className="muted">Please log in to create a resource.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Create</p>
          <h2>Add a new resource</h2>
          <p className="muted">Share a helpful link for other learners.</p>
        </div>
      </div>

      <div className="card">
        <form className="login-form" onSubmit={handleSubmit}>
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
              Create resource
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
