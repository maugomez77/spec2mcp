from spec2mcp.ingestors.openapi import OpenAPIIngestor
from spec2mcp.ingestors.postman import PostmanIngestor
from spec2mcp.ingestors.graphql import GraphQLIngestor
from spec2mcp.ingestors.db_schema import DBSchemaIngestor
from spec2mcp.ingestors.spring_mvc import SpringMVCIngestor
from spec2mcp.ingestors.wsdl import WSDLIngestor
from spec2mcp.ingestors.grpc import GrpcIngestor

INGESTORS: dict[str, type] = {
    "openapi": OpenAPIIngestor,
    "postman": PostmanIngestor,
    "graphql": GraphQLIngestor,
    "db_schema": DBSchemaIngestor,
    "spring_mvc": SpringMVCIngestor,
    "wsdl": WSDLIngestor,
    "grpc": GrpcIngestor,
}


def detect_type(path: str, content: str | None = None) -> str | None:
    for name, cls in INGESTORS.items():
        if cls.can_handle(path, content):
            return name
    return None


def get_ingestor(name: str):
    cls = INGESTORS.get(name)
    if cls is None:
        raise ValueError(f"Unknown ingestor: {name}")
    return cls
