from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from spec2mcp.api.mcp import router as mcp_router, set_active_project
from spec2mcp.api.routes import router as api_router
from spec2mcp.api.seed import seed_demo
from spec2mcp.config import ensure_dirs
from spec2mcp.db import store

ensure_dirs()

app = FastAPI(
    title="spec2mcp API",
    description="Turn any API artifact into an MCP server",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mcp_router)
app.include_router(api_router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


@app.on_event("startup")
async def startup():
    await seed_demo()
    projects = store.list_projects()
    if projects:
        set_active_project(projects[0].id)
