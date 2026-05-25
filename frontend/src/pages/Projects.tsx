import { useEffect, useState } from 'react'
import { fetchProjects, createProject } from '../lib/api'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Plus,
  X,
  ExternalLink,
  ArrowRight,
  Globe,
  Box,
  Wrench,
} from 'lucide-react'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  const load = () => fetchProjects().then(setProjects).catch(() => setProjects([]))
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await createProject(name.trim(), baseUrl.trim() || undefined)
    setName('')
    setBaseUrl('')
    setShowForm(false)
    load()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your API bridges to AI agents</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showForm
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
          }`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-slate-800 mb-4">Create a new project</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Project Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                placeholder="my-api"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Base URL <span className="text-slate-300">(optional)</span></label>
              <input
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors font-mono"
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Create Project
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No projects yet</h3>
          <p className="text-sm text-slate-400 mb-6">Create your first project to start bridging APIs to AI agents</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(p => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">{p.name}</p>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {p.base_url ? (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Globe size={12} />
                          {p.base_url}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">No base URL</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Artifacts</p>
                      <p className="text-sm font-semibold text-slate-700">{p.artifact_count}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Tools</p>
                      <p className="text-sm font-semibold text-slate-700">{p.tool_count}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
