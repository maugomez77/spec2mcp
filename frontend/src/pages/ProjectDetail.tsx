import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProjects, fetchArtifacts, fetchEndpointsByProject } from '../lib/api'
import {
  ArrowLeft,
  Globe,
  FileCode2,
  Puzzle,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<any>(null)
  const [artifacts, setArtifacts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchProjects().then(ps => setProject(ps.find((p: any) => p.id === id)))
    fetchArtifacts(id).then(setArtifacts).catch(() => setArtifacts([]))
    fetchEndpointsByProject(id).then(setTools).catch(() => setTools([]))
  }, [id])

  const copyConfig = async () => {
    await navigator.clipboard.writeText(JSON.stringify({
      mcpServers: {
        spec2mcp: { url: 'https://spec2mcp-demo.onrender.com/mcp/' }
      }
    }, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!project) return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <p className="text-sm text-slate-400">Loading project...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to projects
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            {project.base_url && (
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Globe size={14} />
                {project.base_url}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5 bg-slate-50 rounded-xl px-5 py-3">
          <div className="text-center">
            <p className="text-xs text-slate-400">Artifacts</p>
            <p className="text-lg font-bold text-slate-700">{artifacts.length}</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <p className="text-xs text-slate-400">Tools</p>
            <p className="text-lg font-bold text-slate-700">{tools.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileCode2 size={18} className="text-brand-600" />
            <h2 className="font-semibold text-slate-800">Artifacts ({artifacts.length})</h2>
          </div>
          {artifacts.length === 0 ? (
            <div className="text-center py-8">
              <FileCode2 size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No artifacts ingested yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {artifacts.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${a.status === 'ready' ? 'bg-emerald-500' : a.status === 'error' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <span className="text-sm font-medium text-slate-700">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-white px-2.5 py-1 rounded-md text-slate-500 font-medium border border-slate-200">{a.type}</span>
                    <span className="text-xs text-slate-400">{a.endpoint_count} endpoints</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Puzzle size={18} className="text-brand-600" />
            <h2 className="font-semibold text-slate-800">MCP Tools ({tools.length})</h2>
          </div>
          {tools.length === 0 ? (
            <div className="text-center py-8">
              <Puzzle size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No tools generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tools.map((t, i) => {
                const isExpanded = expandedTool === t.name
                const hasParams = t.input_schema?.properties && Object.keys(t.input_schema.properties).length > 0
                return (
                  <div key={i} className="rounded-xl border border-slate-100 overflow-hidden transition-all">
                    <button
                      onClick={() => setExpandedTool(isExpanded ? null : t.name)}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-mono font-medium text-slate-800 truncate">{t.name}</span>
                        {!hasParams && (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-400 font-medium whitespace-nowrap">no params</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-slate-400 hidden sm:inline">{t.description?.slice(0, 30)}{t.description?.length > 30 ? '...' : ''}</span>
                        {isExpanded ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mt-2 mb-2">{t.description}</p>
                        {hasParams && (
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs font-medium text-slate-500 mb-2">Parameters</p>
                            <div className="space-y-1.5">
                              {Object.entries(t.input_schema.properties).map(([k, v]: [string, any]) => {
                                const isRequired = t.input_schema.required?.includes(k)
                                return (
                                  <div key={k} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      <code className="font-mono text-slate-800">{k}</code>
                                      {isRequired && <span className="text-red-400 text-[10px] font-medium">required</span>}
                                    </div>
                                    <span className="text-slate-400 font-mono">{v.type}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Puzzle size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-white">MCP Connection</h2>
          </div>
          <button
            onClick={copyConfig}
            className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy config'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">Add this to your agent's MCP configuration to use the generated tools:</p>
        <pre className="bg-black/40 text-emerald-200 text-xs leading-relaxed p-4 rounded-xl overflow-x-auto border border-white/5 font-mono">
{`{
  "mcpServers": {
    "spec2mcp": {
      "url": "https://spec2mcp-demo.onrender.com/mcp/"
    }
  }
}`}
        </pre>
      </div>
    </div>
  )
}
