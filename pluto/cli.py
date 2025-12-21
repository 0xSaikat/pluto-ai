import click
import json
import os
from pathlib import Path
from typing import Optional, List
import sys

def print_banner():
    """Print the Pluto banner with styled text."""
    banner = (
        "\033[1;36m"  
        "\n"
        "╭─────[By 0xSaikat]───────────────────────────────────╮\n"
        "│                                                     │\n"
        "│         ____  __      __                            │\n"
        "│        / __ \\/ /_  __/ /_____                       │\n"
        "│       / /_/ / / / / / __/ __ \\                      │\n"
        "│      / ____/ / /_/ / /_/ /_/ /                      │\n"
        "│     /_/   /_/\\__,_/\\__/\\____/   V-1.0               │\n"
        "│                                                     │\n"
        "│     AI-Powered Code Security Analyzer               │\n"
        "│                                                     │\n"
        "╰─────────────────────────────────[hackbit.org]───────╯\n"
        "\033[0m"  
    )
    print(banner)

@click.group(invoke_without_command=True)
@click.pass_context
@click.version_option(version='1.0.0')
def cli(ctx):
    """Pluto - AI-Powered Code Security Analyzer"""
    if ctx.invoked_subcommand is None:
        print_banner()
        click.echo("\nUse 'pluto scan --help' to see available options\n")

@cli.command()
@click.option('-code', '--code-file', type=click.Path(exists=True), help='Analyze a single code file')
@click.option('-dir', '--directory', type=click.Path(exists=True), help='Analyze entire directory')
@click.option('-git', '--git-repo', type=str, help='Analyze GitHub repository')
@click.option('--provider', type=click.Choice(['claude', 'openai', 'ollama']), default='claude', help='AI provider')
@click.option('--model', type=str, default='claude-sonnet-4-20250514', help='Model name')
@click.option('--report', type=click.Choice(['terminal', 'pdf', 'json', 'html', 'markdown']), default='terminal', help='Report format')
@click.option('--output', type=str, default='pluto_report', help='Output file name (without extension)')
@click.option('--min-severity', type=click.Choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), default='LOW', help='Minimum severity level')
def scan(code_file, directory, git_repo, provider, model, report, output, min_severity):
    """Scan code for security vulnerabilities"""
    print_banner()  
    from pluto.analyzers.code_analyzer import CodeAnalyzer
    from pluto.reporters.terminal_reporter import TerminalReporter
    from pluto.reporters.pdf_reporter import PDFReporter
    from pluto.reporters.json_reporter import JSONReporter
    from pluto.reporters.markdown_reporter import MarkdownReporter
    
    analyzer = CodeAnalyzer(provider=provider, model=model)
    
    
    files_to_analyze = []
    
    if code_file:
        files_to_analyze.append(code_file)
    elif directory:
        files_to_analyze = get_code_files(directory)
    elif git_repo:
        click.echo("Cloning repository...")
        from pluto.analyzers.git_analyzer import GitAnalyzer
        git_analyzer = GitAnalyzer()
        repo_path = git_analyzer.clone_repo(git_repo)
        files_to_analyze = get_code_files(repo_path)
    else:
        click.echo("Error: Please specify -code, -dir, or -git")
        return
    
    if not files_to_analyze:
        click.echo("No code files found to analyze")
        return
    
    click.echo(f"Analyzing {len(files_to_analyze)} file(s)...")
    
    
    all_results = []
    for file_path in files_to_analyze:
        click.echo(f"Scanning: {file_path}")
        results = analyzer.analyze_file(file_path)
        if results:
            all_results.extend(results)
    
    
    severity_order = {'LOW': 0, 'MEDIUM': 1, 'HIGH': 2, 'CRITICAL': 3}
    min_level = severity_order[min_severity]
    filtered_results = [r for r in all_results if severity_order.get(r.get('severity', 'LOW'), 0) >= min_level]
    
    if report == 'terminal' or report == 'terminal':
        reporter = TerminalReporter()
        reporter.generate(filtered_results)
    
    if report == 'pdf':
        reporter = PDFReporter()
        reporter.generate(filtered_results, f"{output}.pdf")
        click.echo(f"\nPDF report saved to: {output}.pdf")
    
    if report == 'json':
        reporter = JSONReporter()
        reporter.generate(filtered_results, f"{output}.json")
        click.echo(f"\nJSON report saved to: {output}.json")
    
    if report == 'markdown':
        reporter = MarkdownReporter()
        reporter.generate(filtered_results, f"{output}.md")
        click.echo(f"\nMarkdown report saved to: {output}.md")

def get_code_files(path):
    """Get all code files from a directory"""
    code_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.swift', '.kt'}
    files = []
    path_obj = Path(path)
    
    if path_obj.is_file():
        return [str(path_obj)]
    
    for file in path_obj.rglob('*'):
        if file.is_file() and file.suffix in code_extensions:
            
            if any(skip in file.parts for skip in ['node_modules', 'venv', '.git', '__pycache__', 'dist', 'build']):
                continue
            files.append(str(file))
    
    return files

if __name__ == '__main__':
    cli()
