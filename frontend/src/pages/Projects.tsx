import { useEffect, useState } from 'react'
import { fetchProjects, createProject } from '../lib/api'
import { Link } from 'react-router-dom'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border p-4 mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="my-api" required />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Base URL (optional)</label>
            <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="https://api.example.com/v1" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Create</button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
          <p className="text-lg mb-2">No projects yet</p>
          <p className="text-sm">Create one with the button above or via CLI: <code className="bg-gray-100 px-2 py-0.5 rounded">spec2mcp init my-project</code></p>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-indigo-700">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.base_url || 'No base URL'}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <span className="mr-3">{p.artifact_count} artifacts</span>
                  <span>{p.tool_count} tools</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
