import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'

export type Resource = {
  id: string
  title: string
  description: string
  url: string
  ownerEmail: string
  createdAt?: string
}

type ResourcesContextValue = {
  resources: Resource[]
  loading: boolean
  error: string | null
  getResourceById: (id: string) => Resource | undefined
  fetchResources: () => Promise<void>
  createResource: (data: { title: string; description: string; url: string }) => Promise<Resource>
  updateResource: (id: string, data: { title: string; description: string; url: string }) => Promise<Resource>
  deleteResource: (id: string) => Promise<void>
}

const ResourcesContext = createContext<ResourcesContextValue | undefined>(undefined)

export const ResourcesProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const { user } = useAuth()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${baseUrl}/resources`)
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`)
      }
      const data = (await response.json()) as Resource[]
      setResources(data)
    } catch (err) {
      console.error('Failed to fetch resources', err)
      setError('Failed to fetch resources')
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  const createResource = useCallback(
    async (data: { title: string; description: string; url: string }) => {
      setError(null)
      try {
        const payload: Resource = {
          ...data,
          id: '',
          ownerEmail: user?.email ?? '',
          createdAt: new Date().toISOString(),
        }
        const response = await fetch(`${baseUrl}/resources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          throw new Error(`Failed to create resource: ${response.status}`)
        }
        const created = (await response.json()) as Resource
        setResources((prev) => [created, ...prev])
        return created
      } catch (err) {
        console.error('Failed to create resource', err)
        setError('Failed to create resource')
        return null as unknown as Resource
      }
    },
    [baseUrl, user?.email],
  )

  const updateResource = useCallback(
    async (id: string, data: { title: string; description: string; url: string }) => {
      setError(null)
      try {
        const response = await fetch(`${baseUrl}/resources/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          throw new Error(`Failed to update resource: ${response.status}`)
        }
        const updated = (await response.json()) as Resource
        setResources((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)))
        return updated
      } catch (err) {
        console.error('Failed to update resource', err)
        setError('Failed to update resource')
        return null as unknown as Resource
      }
    },
    [baseUrl],
  )

  const deleteResource = useCallback(
    async (id: string) => {
      setError(null)
      try {
        const response = await fetch(`${baseUrl}/resources/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(`Failed to delete resource: ${response.status}`)
        }
        setResources((prev) => prev.filter((item) => item.id !== id))
      } catch (err) {
        console.error('Failed to delete resource', err)
        setError('Failed to delete resource')
      }
    },
    [baseUrl],
  )

  const getResourceById = useCallback(
    (id: string) => resources.find((item) => item.id === id),
    [resources],
  )

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const value: ResourcesContextValue = {
    resources,
    loading,
    error,
    getResourceById,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
  }

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useResources = () => {
  const ctx = useContext(ResourcesContext)
  if (!ctx) {
    throw new Error('useResources must be used within ResourcesProvider')
  }
  return ctx
}
