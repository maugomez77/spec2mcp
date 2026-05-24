# spec2mcp — Turn any API artifact into an MCP server

Turn any API spec, database schema, or developer artifact into AI-agent-ready **MCP tools and resources** — with zero MCP expertise required.

## Quick Start

```bash
uv run spec2mcp init                    # Initialize project
uv run spec2mcp add ./openapi.yaml      # Add an OpenAPI spec
uv run spec2mcp add ./schema.sql        # Add a DB schema
uv run spec2mcp serve                   # Start the MCP server
uv run spec2mcp dashboard               # Open the web UI
```

## Architecture

```
spec2mcp/
├── src/spec2mcp/
│   ├── cli/              # Typer + Rich CLI interface
│   │   └── main.py
│   ├── api/              # FastAPI backend (management + MCP protocol)
│   │   ├── server.py     # FastAPI app
│   │   ├── mcp.py        # MCP protocol endpoints
│   │   └── routes/       # REST management routes
│   ├── ingestors/        # Artifact parsers
│   │   ├── openapi.py    # OpenAPI/Swagger -> internal model
│   │   ├── postman.py    # Postman collection -> internal model
│   │   ├── graphql.py    # GraphQL schema -> internal model
│   │   ├── db_schema.py  # SQL/DB schema -> internal model
│   │   └── docs.py       # Plain docs -> internal model
│   ├── generators/       # MCP tool code generators
│   │   ├── mcp_v1.py     # MCP v1 tool definitions
│   │   ├── http_client.py# HTTP client wrapper for generated tools
│   │   └── templates/    # Jinja2 templates for codegen
│   └── models/           # Pydantic models
│       ├── artifact.py   # Artifact model
│       ├── endpoint.py   # Endpoint/tool model
│       └── project.py    # Project/user model
├── frontend/             # React + Vite + TypeScript dashboard
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route pages
│       └── lib/          # API client, utils
├── templates/            # Jinja2 codegen templates
├── pyproject.toml
└── AGENTS.md
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CLI | `typer` + `rich` | Project management and interaction |
| Backend API | `fastapi` + `uvicorn` | Management API + MCP protocol server |
| MCP SDK | `mcp[cli]` | MCP protocol tool definitions |
| Codegen | `jinja2` | Template-based MCP server generation |
| Parsing | `openapi-parser` / `sqlglot` | Artifact ingestion |
| HTTP | `httpx` | Generated tool HTTP calls |
| Frontend | React 18 + TypeScript + Vite | Management dashboard |
| UI Kit | shadcn/ui + Tailwind v4 | Consistent design |
| Database | PostgreSQL (Neon free tier) | Projects, artifacts, API keys |
| Deployment | Vercel (frontend) + Render (API) | Free tier hosting |

## Key Design Principles

1. **Multiple artifact types:** OpenAPI/Swagger, Postman collections, GraphQL schemas, DB schemas (SQL, Prisma, Drizzle), plain documentation
2. **Self-hosted or SaaS:** Deploy via Docker or use the hosted version. Small companies don't have DevOps teams
3. **No MCP knowledge required:** Upload artifacts through CLI or web dashboard, get an MCP endpoint URL back
4. **Per-tool auth:** Each generated MCP tool can carry API keys, OAuth tokens, or basic auth for the upstream API
5. **Live reload:** When the upstream API changes, re-ingest and regenerate — zero downtime
6. **i18n: English + Spanish** — targeting LatAm small businesses too

## MCP Protocol

The generated MCP server exposes:
- **Tools:** Each API endpoint becomes an MCP tool with typed parameters
- **Resources:** API schemas/models become MCP resources for agent context
- **Prompts:** Operation templates (e.g., "Create a new customer" with required fields)

Example: A small invoicing SaaS with `GET /invoices` and `POST /invoices` becomes:
```
tools:
  - get_invoices(filters, page, per_page) -> list
  - create_invoice(customer_id, items, due_date) -> invoice
resources:
  - invoices://schema -> Invoice model definition
  - invoices://help -> Usage guide
```

## Deployment

### Local development
```bash
uv pip install -e ".[dev]"
spec2mcp dashboard  # Opens FastAPI + frontend
```

### Production
- **Frontend:** `cd frontend && vercel --prod`
- **API:** `docker build -t spec2mcp . && docker run -p 8080:8080 spec2mcp`
- Or use the Render blueprint: `render.yaml`
