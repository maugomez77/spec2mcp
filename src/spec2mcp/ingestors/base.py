from abc import ABC, abstractmethod
from spec2mcp.models.artifact import Artifact, ArtifactType
from spec2mcp.models.endpoint import Endpoint


class BaseIngestor(ABC):
    artifact_type: ArtifactType

    @classmethod
    @abstractmethod
    def can_handle(cls, path: str, content: str | None = None) -> bool:
        ...

    @abstractmethod
    async def ingest(self, artifact: Artifact) -> tuple[Artifact, list[Endpoint]]:
        ...
