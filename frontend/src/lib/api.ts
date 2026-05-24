const API_BASE = '/api'

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }
  return res.json()
}

export function fetchHealth() {
  return fetcher<{ status: string; version: string }>('/health')
}

export function fetchStatus() {
  return fetcher<{ projects: number; artifacts: number; tools: number }>('/status')
}

export function fetchProjects() {
  return fetcher<Array<{ id: string; name: string; base_url: string | null; artifact_count: number; tool_count: number; created_at: string }>>('/projects')
}

export function createProject(name: string, baseUrl?: string) {
  return fetcher<{ id: string; name: string }>('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, base_url: baseUrl }),
  })
}

export function fetchArtifacts(projectId?: string) {
  const params = projectId ? `?project_id=${projectId}` : ''
  return fetcher<Array<{ id: string; name: string; type: string; status: string; endpoint_count: number; project_id: string }>>(`/artifacts${params}`)
}

export function fetchEndpointsByProject(projectId: string) {
  return fetcher<Array<{ name: string; description: string; input_schema: any; endpoint: any }>>(`/endpoints/by-project/${projectId}`)
}
