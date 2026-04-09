import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PageLayout from './components/layout/PageLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import LogEntry from './pages/LogEntry'
import LogHistory from './pages/LogHistory'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<PageLayout />}>
              <Route index element={<Home />} />
              <Route path="log/new" element={<LogEntry />} />
              <Route path="history" element={<LogHistory />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App


