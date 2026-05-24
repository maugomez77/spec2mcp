import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProjects, fetchArtifacts, fetchEndpointsByProject } from '../lib/api'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<any>(null)
  const [artifacts, setArtifacts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    fetchProjects().then(ps => setProject(ps.find((p: any) => p.id === id)))
    fetchArtifacts(id).then(setArtifacts).catch(() => setArtifacts([]))
    fetchEndpointsByProject(id).then(setTools).catch(() => setTools([]))
  }, [id])

  if (!project) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{project.base_url || 'No base URL'}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">Artifacts ({artifacts.length})</h2>
          {artifacts.length === 0 ? (
            <p className="text-sm text-gray-400">No artifacts. Run <code className="bg-gray-100 px-1 rounded text-xs">spec2mcp add</code></p>
          ) : (
            <ul className="space-y-2">
              {artifacts.map(a => (
                <li key={a.id} className="text-sm flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'ready' ? 'bg-emerald-500' : 'bg-yellow-400'}`} />
                  <span className="font-medium">{a.name}</span>
                  <span className="text-xs text-gray-400">{a.type} · {a.endpoint_count} endpoints</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold mb-3">MCP Tools ({tools.length})</h2>
          {tools.length === 0 ? (
            <p className="text-sm text-gray-400">No tools generated yet</p>
          ) : (
            <ul className="space-y-2">
              {tools.map((t, i) => (
                <li key={i} className="text-sm">
                  <span className="font-mono text-indigo-700 font-medium">{t.name}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                  {t.input_schema?.properties && Object.keys(t.input_schema.properties).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(t.input_schema.properties).map(([k, v]: [string, any]) => (
                        <span key={k} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                          {k}: {v.type}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border p-5">
        <h2 className="font-semibold mb-3">MCP Connection</h2>
        <p className="text-xs text-gray-500 mb-2">Add this to your agent config to use the generated tools:</p>
        <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">
{`{
  "mcpServers": {
    "spec2mcp": {
      "url": "http://localhost:8080/mcp/"
    }
  }
}`}
        </pre>
      </div>
    </div>
  )
}
