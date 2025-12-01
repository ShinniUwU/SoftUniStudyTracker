import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { TopicDetails } from './pages/TopicDetails'
import { ExamPrep } from './pages/ExamPrep'
import { LoginPage } from './pages/LoginPage'
import { ResourcesList } from './pages/ResourcesList'
import { ResourceDetails } from './pages/ResourceDetails'
import { ResourceCreate } from './pages/ResourceCreate'
import { ResourceEdit } from './pages/ResourceEdit'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="topic/:topicId"
          element={
            <ProtectedRoute>
              <TopicDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="exam"
          element={
            <ProtectedRoute>
              <ExamPrep />
            </ProtectedRoute>
          }
        />
        <Route path="resources" element={<ResourcesList />} />
        <Route path="resources/:resourceId" element={<ResourceDetails />} />
        <Route
          path="resources/create"
          element={
            <ProtectedRoute>
              <ResourceCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="resources/:resourceId/edit"
          element={
            <ProtectedRoute>
              <ResourceEdit />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
