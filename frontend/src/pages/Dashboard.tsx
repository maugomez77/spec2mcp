import { useEffect, useState } from 'react'
import { fetchHealth, fetchStatus, fetchProjects } from '../lib/api'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  FileCode2,
  Puzzle,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default function Dashboard() {
  const [health, setHealth] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => setHealth(null))
    fetchStatus().then(setStats).catch(() => setStats(null))
    fetchProjects().then(setProjects).catch(() => setProjects([]))
  }, [])

  const cards = [
    { label: 'Projects', value: stats?.projects ?? '—', icon: FolderKanban, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Artifacts', value: stats?.artifacts ?? '—', icon: FileCode2, color: 'from-emerald-500 to-emerald-600' },
    { label: 'MCP Tools', value: stats?.tools ?? '—', icon: Puzzle, color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your MCP bridge ecosystem</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Sparkles size={16} />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg flex flex-col justify-end min-h-[140px]">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-95`} />
              <div className="relative z-10 p-6">
                <Icon size={24} className="text-white/80 mb-3" />
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-sm text-white/70 mt-1">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Recent Projects</h2>
            <Link to="/projects" className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderKanban size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-semibold text-sm">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 group-hover:text-brand-700 transition-colors">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.artifact_count} artifacts · {p.tool_count} tools</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-5">API Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Activity size={18} className={health ? 'text-emerald-500' : 'text-slate-300'} />
                <span className="text-sm font-medium text-slate-700">Backend</span>
              </div>
              <div className="flex items-center gap-2">
                {health ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">{health.status}</span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">Connecting...</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 text-white">
              <p className="text-xs text-slate-400 mb-2">MCP Endpoint</p>
              <code className="text-sm font-mono text-emerald-300 break-all">https://spec2mcp-demo.onrender.com/mcp/</code>
            </div>

            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-brand-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-800">Connect from any AI agent</p>
                  <p className="text-xs text-brand-600 mt-1">
                    Use this MCP endpoint to let Claude, Cursor, or any agent consume your APIs natively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
