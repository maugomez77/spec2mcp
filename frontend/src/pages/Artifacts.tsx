export default function Artifacts() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Artifacts</h1>
      <div className="bg-white rounded-xl border p-12 text-center text-gray-400">
        <p className="text-lg mb-2">No artifacts ingested yet</p>
        <p className="text-sm">Use the CLI: <code className="bg-gray-100 px-2 py-0.5 rounded">spec2mcp add ./openapi.yaml</code></p>
      </div>
    </div>
  )
}
