import { useEffect, useState } from 'react'
import { fetchArtifacts, fetchProjects } from '../lib/api'
import {
  FileCode2,
  FileJson,
  Database,
  Braces,
  FileText,
  Layers,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

const typeIcons: Record<string, typeof FileCode2> = {
  openapi: FileJson,
  postman: Braces,
  graphql: FileCode2,
  db_schema: Database,
  docs: FileText,
}

const typeColors: Record<string, string> = {
  openapi: 'bg-blue-50 text-blue-600 border-blue-200',
  postman: 'bg-orange-50 text-orange-600 border-orange-200',
  graphql: 'bg-pink-50 text-pink-600 border-pink-200',
  db_schema: 'bg-purple-50 text-purple-600 border-purple-200',
  docs: 'bg-slate-50 text-slate-600 border-slate-200',
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  ready: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
}

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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artifacts</h1>
          <p className="text-sm text-slate-500 mt-1">All ingested API specifications and schemas</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-sm bg-transparent border-none focus:outline-none text-slate-600"
          >
            <option value="">All projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Layers size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No artifacts</h3>
          <p className="text-sm text-slate-400 mb-6">Ingest an API specification to get started</p>
          <code className="bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-600 font-mono">spec2mcp add ./openapi.yaml</code>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Name</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Endpoints</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(a => {
                  const Icon = typeIcons[a.type] || FileCode2
                  const typeColor = typeColors[a.type] || typeColors.docs
                  const st = statusConfig[a.status] || statusConfig.pending
                  const StatusIcon = st.icon
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Icon size={18} className="text-slate-400" />
                          <span className="text-sm font-medium text-slate-800">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md border ${typeColor}`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${st.bg} ${st.color}`}>
                          <StatusIcon size={12} />
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-700">{a.endpoint_count}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{projectName(a.project_id)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
