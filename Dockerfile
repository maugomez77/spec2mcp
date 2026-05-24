FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install uv && uv pip install --system -e .

COPY src/ src/
COPY templates/ templates/

EXPOSE 8080

CMD ["uvicorn", "spec2mcp.api.server:app", "--host", "0.0.0.0", "--port", "8080"]
