import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { StudyProvider } from './context/StudyContext'
import { ResourcesProvider } from './context/ResourcesContext'
import { ThemeProvider } from './context/ThemeContext'
import { CourseProvider } from './context/CourseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CourseProvider>
            <StudyProvider>
              <ResourcesProvider>
                <App />
              </ResourcesProvider>
            </StudyProvider>
          </CourseProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
