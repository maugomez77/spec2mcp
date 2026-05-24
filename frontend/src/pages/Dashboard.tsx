import { useEffect, useState } from 'react'
import { fetchHealth, fetchStatus, fetchProjects } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [health, setHealth] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => setHealth(null))
    fetchStatus().then(setStats).catch(() => setStats(null))
    fetchProjects().then(setProjects).catch(() => setProjects([]))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Projects" value={stats?.projects ?? '—'} color="indigo" />
        <StatCard label="Artifacts" value={stats?.artifacts ?? '—'} color="emerald" />
        <StatCard label="MCP Tools" value={stats?.tools ?? '—'} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-400">No projects yet</p>
          ) : (
            <ul className="space-y-2">
              {projects.map(p => (
                <li key={p.id}>
                  <Link to={`/projects/${p.id}`} className="text-indigo-600 hover:underline text-sm font-medium">
                    {p.name}
                  </Link>
                  <span className="text-xs text-gray-400 ml-2">{p.artifact_count} artifacts · {p.tool_count} tools</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">API Status</h2>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {health ? `${health.status} (v${health.version})` : 'Connecting...'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            MCP endpoint: <code className="bg-gray-100 px-1.5 py-0.5 rounded">http://localhost:8080/mcp/</code>
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = { indigo: 'bg-indigo-50 text-indigo-700', emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' }
  return (
    <div className={`rounded-xl border p-5 ${colors[color] || 'bg-white'}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
