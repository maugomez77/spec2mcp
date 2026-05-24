from spec2mcp.ingestors.openapi import OpenAPIIngestor
from spec2mcp.ingestors.postman import PostmanIngestor
from spec2mcp.ingestors.graphql import GraphQLIngestor
from spec2mcp.ingestors.db_schema import DBSchemaIngestor

INGESTORS = {
    "openapi": OpenAPIIngestor,
    "postman": PostmanIngestor,
    "graphql": GraphQLIngestor,
    "db_schema": DBSchemaIngestor,
}


def detect_type(path: str, content: str | None = None) -> str | None:
    for name, cls in INGESTORS.items():
        if cls.can_handle(path, content):
            return name
    return None
