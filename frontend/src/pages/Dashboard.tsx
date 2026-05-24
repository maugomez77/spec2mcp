import { useEffect, useState } from 'react'
import { fetchHealth } from '../lib/api'

export default function Dashboard() {
  const [health, setHealth] = useState<{ status: string; version: string } | null>(null)

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => setHealth(null))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Projects" value="0" />
        <StatCard label="Artifacts" value="0" />
        <StatCard label="MCP Tools" value="0" />
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-2">API Status</h2>
        <p className="text-sm text-gray-500">
          {health ? `✓ ${health.status} (v${health.version})` : '○ Connecting...'}
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
