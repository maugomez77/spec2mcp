import { useEffect, useState } from 'react'
import { fetchArtifacts, fetchProjects } from '../lib/api'

export default function Artifacts() {
  const [artifacts, setArtifacts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => setProjects([]))
    fetchArtifacts().then(setArtifacts).catch(() => setArtifacts([]))
  }, [])

  const filtered = filter ? artifacts.filter(a => a.project_id === filter) : artifacts

  const projectName = (id: string) => projects.find(p => p.id === id)?.name || id

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Artifacts</h1>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">All projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-lg mb-2">No artifacts</p>
          <p className="text-sm">Use the CLI: <code className="bg-gray-100 px-2 py-0.5 rounded">spec2mcp add ./openapi.yaml</code></p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Endpoints</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Project</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{a.type}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${a.status === 'ready' ? 'text-emerald-700' : a.status === 'error' ? 'text-red-500' : 'text-yellow-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'ready' ? 'bg-emerald-500' : a.status === 'error' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{a.endpoint_count}</td>
                  <td className="px-4 py-3 text-gray-500">{projectName(a.project_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
