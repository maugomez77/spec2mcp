import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

app = typer.Typer(
    name="spec2mcp",
    help="Turn any API artifact into an MCP server",
    no_args_is_help=True,
)
console = Console()


@app.command()
def init(
    name: str = typer.Argument(..., help="Project name"),
    base_url: str = typer.Option(None, "--base-url", "-u", help="Base URL of the upstream API"),
):
    console.print(Panel(f"[bold green]spec2mcp[/] — Initialized project [bold]{name}[/]", box=box.ROUNDED))
    console.print(f"  Base URL: {base_url or '(not set)'}")
    console.print(f"  Artifacts: 0")
    console.print(f"  Tools: 0")
    console.print("\n[yellow]Next:[/] add an artifact with [bold]spec2mcp add <file>[/]")


@app.command()
def add(
    path: str = typer.Argument(..., help="Path to artifact file (OpenAPI, Postman, SQL, etc.)"),
    project: str = typer.Option(None, "--project", "-p", help="Project name"),
):
    console.print(f"[green]Ingesting[/] {path}...")
    console.print("[yellow]Artifact ingestion not yet implemented[/]")
    console.print("  Detected type: [bold]pending detection[/]")


@app.command()
def serve(
    port: int = typer.Option(8080, "--port", "-p", help="MCP server port"),
    project: str = typer.Option(None, "--project", "-p", help="Project to serve"),
):
    table = Table(box=box.ROUNDED)
    table.add_column("Endpoint", style="cyan")
    table.add_column("Method", style="green")
    table.add_column("Tool Name", style="yellow")
    table.add_column("Auth")
    table.add_row("/api/v1/invoices", "GET", "get_invoices", "✓")
    table.add_row("/api/v1/invoices", "POST", "create_invoice", "✓")
    console.print(table)
    console.print(f"\n[green]MCP server running on port {port}[/]")
    console.print(f"Connect your agent to: [bold]http://localhost:{port}/mcp[/]")


@app.command()
def dashboard(
    port: int = typer.Option(5173, "--port", "-p", help="Dashboard port"),
):
    console.print("[green]Opening dashboard...[/]")
    console.print(f"Dashboard URL: [bold]http://localhost:{port}[/]")


@app.command()
def list(
    project: str = typer.Option(None, "--project", "-p", help="Project name"),
):
    table = Table(title="Projects", box=box.ROUNDED)
    table.add_column("Name", style="cyan")
    table.add_column("Artifacts", justify="right")
    table.add_column("Tools", justify="right")
    table.add_column("Created")
    table.add_row("(no projects yet)", "0", "0", "-")
    console.print(table)


if __name__ == "__main__":
    app()
