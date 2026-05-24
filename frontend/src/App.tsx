import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Artifacts from './pages/Artifacts'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/artifacts', label: 'Artifacts' },
]

export default function App() {
  const loc = useLocation()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-3 flex items-center gap-6 shadow-sm">
        <Link to="/" className="font-bold text-lg text-indigo-600 tracking-tight">spec2mcp</Link>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-sm ${loc.pathname === l.to ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/artifacts" element={<Artifacts />} />
        </Routes>
      </main>
    </div>
  )
}
