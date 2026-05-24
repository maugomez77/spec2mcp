# spec2mcp

Convierte cualquier artefacto de API en un servidor MCP — sin necesidad de experiencia en MCP.

## Inicio Rápido

```bash
uv run spec2mcp init mi-proyecto
uv run spec2mcp add ./openapi.yaml
uv run spec2mcp serve
```

## ¿Qué es MCP?

El Protocolo de Contexto de Modelo (MCP) permite que agentes de IA (como Claude)
consuman herramientas y recursos de API de forma nativa. spec2mcp elimina la
complejidad: tú subes tu especificación, nosotros generamos el servidor MCP.

## Artefactos Soportados

- OpenAPI / Swagger
- Colecciones de Postman
- Schemas de GraphQL
- Schemas de Base de Datos (SQL, Prisma)
- Documentación técnica
