from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(prefix="/mcp", tags=["mcp"])


class MCPRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: dict | None = None
    id: int | str


class MCPTool(BaseModel):
    name: str
    description: str | None = None
    input_schema: dict = {}


@router.post("/")
async def mcp_endpoint(req: MCPRequest):
    if req.method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "result": {"tools": []},
            "id": req.id,
        }
    if req.method == "resources/list":
        return {
            "jsonrpc": "2.0",
            "result": {"resources": []},
            "id": req.id,
        }
    return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": req.id}
