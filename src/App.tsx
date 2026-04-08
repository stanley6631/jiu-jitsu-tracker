import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import Home from './pages/Home'
import LogEntry from './pages/LogEntry'
import LogHistory from './pages/LogHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="log/new" element={<LogEntry />} />
          <Route path="history" element={<LogHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

