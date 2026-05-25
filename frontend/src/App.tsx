import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  FileCode2,
  Cable,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Artifacts from './pages/Artifacts'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/artifacts', label: 'Artifacts', icon: FileCode2 },
]

export default function App() {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-sidebar flex-shrink-0 flex flex-col">
        <div className="px-5 pt-6 pb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">s</div>
            <span className="text-white font-semibold text-base tracking-tight">spec2mcp</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = loc.pathname === item.to || (item.to !== '/' && loc.pathname.startsWith(item.to))
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Cable size={14} />
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto scrollbar-thin">
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
