from fastapi import APIRouter
from pydantic import BaseModel
from spec2mcp.db import store
from spec2mcp.generators.mcp_v1 import generate_tool_definitions

router = APIRouter(prefix="/mcp", tags=["mcp"])
_active_project_id: str | None = None


def set_active_project(project_id: str):
    global _active_project_id
    _active_project_id = project_id


class MCPRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: dict | None = None
    id: int | str


@router.post("/")
async def mcp_endpoint(req: MCPRequest):
    if req.method == "tools/list":
        if not _active_project_id:
            return {"jsonrpc": "2.0", "result": {"tools": []}, "id": req.id}
        proj = store.get_project_by_id(_active_project_id)
        if not proj:
            return {"jsonrpc": "2.0", "result": {"tools": []}, "id": req.id}
        endpoints = store.get_endpoints_by_project(_active_project_id)
        tools = generate_tool_definitions(endpoints, proj)
        return {
            "jsonrpc": "2.0",
            "result": {
                "tools": [
                    {"name": t["name"], "description": t["description"], "input_schema": t["input_schema"]}
                    for t in tools
                ]
            },
            "id": req.id,
        }

    if req.method == "resources/list":
        if not _active_project_id:
            return {"jsonrpc": "2.0", "result": {"resources": []}, "id": req.id}
        artifacts = store.list_artifacts(_active_project_id)
        return {
            "jsonrpc": "2.0",
            "result": {
                "resources": [
                    {
                        "uri": f"spec2mcp://{_active_project_id}/{a.id}",
                        "name": a.name,
                        "description": f"{a.type.value}: {a.endpoint_count} endpoints",
                        "mimeType": "application/json",
                    }
                    for a in artifacts
                ]
            },
            "id": req.id,
        }

    if req.method == "tools/call":
        tool_name = (req.params or {}).get("name", "")
        arguments = (req.params or {}).get("arguments", {})
        if not _active_project_id:
            return {"jsonrpc": "2.0", "error": {"code": -32603, "message": "No active project"}, "id": req.id}
        proj = store.get_project_by_id(_active_project_id)
        endpoints = store.get_endpoints_by_project(_active_project_id)
        tools = generate_tool_definitions(endpoints, proj)
        matched = next((t for t in tools if t["name"] == tool_name), None)
        if not matched:
            return {"jsonrpc": "2.0", "error": {"code": -32602, "message": f"Unknown tool: {tool_name}"}, "id": req.id}
        meta = matched.get("_meta", {})
        ep = next((e for e in endpoints if e.method.value == meta.get("method", "") and e.path == meta.get("path", "")), None)
        if not ep or not proj.base_url:
            return {
                "jsonrpc": "2.0",
                "result": {"content": [{"type": "text", "text": f"[dry-run] Would call {meta.get('method', 'GET')} {meta.get('path', '/')} with {arguments}"}]},
                "id": req.id,
            }
        from spec2mcp.generators.http_client import GeneratedClient
        client = GeneratedClient(proj)
        try:
            result = await client.call_endpoint(ep, **arguments)
            return {"jsonrpc": "2.0", "result": {"content": [{"type": "text", "text": str(result)}]}, "id": req.id}
        except Exception as e:
            return {"jsonrpc": "2.0", "result": {"content": [{"type": "text", "text": f"Error: {e}"}]}, "id": req.id}

    return {"jsonrpc": "2.0", "error": {"code": -32601, "message": f"Method not found: {req.method}"}, "id": req.id}
