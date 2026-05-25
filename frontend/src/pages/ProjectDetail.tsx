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
  ExternalLink,
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
      mcpServers: { spec2mcp: { url: 'https://spec2mcp-demo.onrender.com/mcp/' } }
    }, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!project) return (
    <div className="p-10 max-w-6xl mx-auto flex justify-center py-24">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-200" />
        <div className="w-40 h-4 rounded-full bg-slate-200" />
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors font-medium">
        <ArrowLeft size={15} />
        Back to projects
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25 flex-shrink-0">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              {project.base_url ? (
                <div className="flex items-center gap-1.5 mt-2">
                  <Globe size={14} className="text-slate-400" />
                  <p className="text-sm text-slate-500 font-mono">{project.base_url}</p>
                  <ExternalLink size={12} className="text-slate-300" />
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-2 italic">No base URL configured</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 bg-slate-50 rounded-xl px-6 py-4">
            <div className="text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Artifacts</p>
              <p className="text-2xl font-bold text-slate-700">{artifacts.length}</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Tools</p>
              <p className="text-2xl font-bold text-indigo-600">{tools.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-100">
                <FileCode2 size={16} className="text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-800">Artifacts ({artifacts.length})</h2>
            </div>
            {artifacts.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No artifacts ingested yet</p>
            ) : (
              <div className="space-y-2.5">
                {artifacts.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${a.status === 'ready' ? 'bg-emerald-500' : a.status === 'error' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      <span className="text-sm font-medium text-slate-700">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-500 font-medium">{a.type}</span>
                      <span className="text-xs text-slate-400">{a.endpoint_count} endpoints</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-indigo-100">
                <Puzzle size={16} className="text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-800">MCP Tools ({tools.length})</h2>
            </div>
            {tools.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No tools generated yet</p>
            ) : (
              <div className="space-y-2">
                {tools.map((t, i) => {
                  const isExpanded = expandedTool === t.name
                  const hasParams = t.input_schema?.properties && Object.keys(t.input_schema.properties).length > 0
                  return (
                    <div key={i} className="rounded-lg border border-slate-100 bg-white overflow-hidden transition-all">
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : t.name)}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span className="text-sm font-mono font-medium text-slate-800 truncate">{t.name}</span>
                          {!hasParams && (
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap ml-1">no args</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs text-slate-400 hidden sm:block">{t.description?.slice(0, 35)}{(t.description?.length ?? 0) > 35 ? '...' : ''}</span>
                          {isExpanded ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-100">
                          <p className="text-xs text-slate-500 mt-3 mb-3">{t.description}</p>
                          {hasParams && (
                            <div className="bg-slate-50 rounded-lg p-3.5">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Parameters</p>
                              <div className="space-y-2">
                                {Object.entries(t.input_schema.properties).map(([k, v]: [string, any]) => {
                                  const isRequired = t.input_schema.required?.includes(k)
                                  return (
                                    <div key={k} className="flex items-center justify-between text-xs bg-white rounded-md px-3 py-2 border border-slate-100">
                                      <div className="flex items-center gap-2">
                                        <code className="font-mono font-medium text-slate-800">{k}</code>
                                        {isRequired && <span className="text-[10px] text-red-400 font-semibold bg-red-50 px-1.5 py-0.5 rounded">required</span>}
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
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/10">
              <Puzzle size={17} className="text-emerald-400" />
            </div>
            <h2 className="font-semibold text-white">MCP Connection</h2>
          </div>
          <button
            onClick={copyConfig}
            className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3.5 py-2 rounded-lg transition-colors font-medium"
          >
            {copied ? (
              <>
                <CheckCheck size={14} className="text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy config
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">Add this to your agent&apos;s MCP configuration to start using the generated tools:</p>
        <pre className="bg-black/30 text-emerald-200/80 text-xs leading-relaxed p-5 rounded-xl overflow-x-auto border border-white/5 font-mono">
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
