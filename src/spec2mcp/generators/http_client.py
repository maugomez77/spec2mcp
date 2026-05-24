import httpx
from spec2mcp.models.endpoint import Endpoint, HttpMethod
from spec2mcp.models.project import Project


_GET_LIKE = {HttpMethod.get, HttpMethod.delete, HttpMethod.head, HttpMethod.options}


class GeneratedClient:
    def __init__(self, project: Project):
        self.base_url = project.base_url or ""
        self.api_key = project.api_key
        self.auth_header = project.auth_header
        self.auth_scheme = project.auth_scheme
        self._client = httpx.AsyncClient()

    def _build_headers(self) -> dict:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers[self.auth_header] = f"{self.auth_scheme} {self.api_key}"
        return headers

    async def call_endpoint(self, ep: Endpoint, **kwargs) -> dict:
        url = f"{self.base_url.rstrip('/')}{ep.path}"
        headers = self._build_headers()
        params = {k: v for k, v in kwargs.items() if v is not None}
        is_get_like = ep.method in _GET_LIKE
        response = await self._client.request(
            method=ep.method.value,
            url=url,
            headers=headers,
            params=params if is_get_like else None,
            json=params if not is_get_like else None,
        )
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self._client.aclose()
