import { Link, Outlet } from 'react-router-dom'

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            🥋 BJJ Tracker
          </Link>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/log/new" className="hover:text-white transition-colors">
              Log Session
            </Link>
            <Link to="/history" className="hover:text-white transition-colors">
              History
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
