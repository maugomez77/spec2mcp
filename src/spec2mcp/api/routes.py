from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from spec2mcp.db import store
from spec2mcp.models.artifact import Artifact, ArtifactType
from spec2mcp.models.project import Project

router = APIRouter(prefix="/api", tags=["api"])


class CreateProjectRequest(BaseModel):
    name: str
    base_url: str | None = None


class AddArtifactRequest(BaseModel):
    project_id: str
    name: str
    type: str
    source_path: str | None = None
    raw_content: str | None = None


@router.get("/projects")
async def list_projects():
    return store.list_projects()


@router.post("/projects")
async def create_project(req: CreateProjectRequest):
    existing = store.get_project(req.name)
    if existing:
        raise HTTPException(400, f"Project '{req.name}' already exists")
    project = store.create_project(name=req.name, base_url=req.base_url)
    return project


@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    project = store.get_project_by_id(project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@router.patch("/projects/{project_id}")
async def update_project(project_id: str, req: CreateProjectRequest):
    project = store.get_project_by_id(project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    project.name = req.name
    if req.base_url:
        project.base_url = req.base_url
    store.update_project(project)
    return project


@router.get("/artifacts")
async def list_artifacts(project_id: str | None = None):
    return store.list_artifacts(project_id)


@router.get("/artifacts/{artifact_id}")
async def get_artifact(artifact_id: str):
    artifact = store.get_artifact(artifact_id)
    if not artifact:
        raise HTTPException(404, "Artifact not found")
    return artifact


@router.get("/endpoints")
async def list_endpoints(artifact_id: str | None = None):
    return store.get_endpoints(artifact_id)


@router.get("/endpoints/by-project/{project_id}")
async def get_project_endpoints(project_id: str):
    endpoints = store.get_endpoints_by_project(project_id)
    from spec2mcp.generators.mcp_v1 import generate_tool_definitions
    project = store.get_project_by_id(project_id)
    if project:
        tools = generate_tool_definitions(endpoints, project)
        for i, t in enumerate(tools):
            t["endpoint"] = endpoints[i].model_dump(mode="json") if i < len(endpoints) else None
        return tools
    return endpoints


@router.get("/status")
async def status():
    projects = store.list_projects()
    artifacts = store.list_artifacts()
    total_tools = 0
    for p in projects:
        total_tools += len(store.get_endpoints_by_project(p.id))
    return {
        "projects": len(projects),
        "artifacts": len(artifacts),
        "tools": total_tools,
    }
