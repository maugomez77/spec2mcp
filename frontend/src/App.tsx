import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Artifacts from './pages/Artifacts'

export default function App() {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white px-6 py-3 flex items-center gap-6">
        <Link to="/" className="font-bold text-lg text-indigo-600">spec2mcp</Link>
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
        <Link to="/projects" className="text-sm text-gray-600 hover:text-gray-900">Projects</Link>
        <Link to="/artifacts" className="text-sm text-gray-600 hover:text-gray-900">Artifacts</Link>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/artifacts" element={<Artifacts />} />
        </Routes>
      </main>
    </div>
  )
}
