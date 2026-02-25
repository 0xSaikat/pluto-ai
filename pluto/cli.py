import click
import os
from pathlib import Path
import sys
import time
import threading

def print_banner():
    """Print animated banner on first run"""
    from pluto.utils.banner import AnimatedBanner
    from pluto.utils.setup_wizard import SetupWizard
    
    if not SetupWizard.config_exists():
        SetupWizard.run()
        print("\n")
    
    AnimatedBanner.full_animation()

@click.group(invoke_without_command=True)
@click.pass_context
@click.version_option(version='1.2.0')
@click.option('--no-banner', is_flag=True, help='Skip animated banner')
@click.option('--reset', is_flag=True, help='Reset configuration')
def cli(ctx, no_banner, reset):
    """Pluto - AI-Powered Code Security Analyzer"""
    from pluto.utils.setup_wizard import SetupWizard
    
    if reset:
        config_path = SetupWizard.get_config_path()
        if config_path.exists():
            config_path.unlink()
            click.echo("✓ Configuration reset. Run 'pluto' to setup again.")
        return
    
    if ctx.invoked_subcommand is None:
        if not no_banner:
            print_banner()
        else:
            click.echo("Pluto - AI Security Scanner")
        click.echo("\nCommands:")
        click.echo("  pluto scan         - Scan code for vulnerabilities")
        click.echo("  pluto pip install  - Safely install Python packages")
        click.echo("  pluto npm install  - Safely install NPM packages")
        click.echo("\nUse 'pluto --help' for more options\n")

class AIProgressTracker:
    """Track and display AI analysis progress"""
    
    ORANGE = '\033[38;5;208m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'
    
    def __init__(self):
        self.running = False
        self.current_stage = ""
        self.elapsed = 0
        self.thread = None
    
    def start(self, filename):
        """Start progress tracking"""
        self.running = True
        self.filename = filename
        self.elapsed = 0
        self.stages = [
            "Reading code structure",
            "Analyzing syntax patterns",
            "Checking for SQL injection",
            "Scanning for XSS vulnerabilities",
            "Detecting hardcoded secrets",
            "Examining authentication flow",
            "Validating input sanitization",
            "Reviewing crypto usage",
            "AI deep analysis",
            "Generating report"
        ]
        self.current_stage_idx = 0
        self.thread = threading.Thread(target=self._animate)
        self.thread.daemon = True
        self.thread.start()
    
    def _animate(self):
        """Animate progress bar"""
        frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        frame_idx = 0
        
        while self.running:
            if self.elapsed > 0 and self.elapsed % 20 == 0:
                self.current_stage_idx = min(
                    self.current_stage_idx + 1, 
                    len(self.stages) - 1
                )
            
            stage = self.stages[self.current_stage_idx]
            frame = frames[frame_idx % len(frames)]
            
            progress = min(int((self.current_stage_idx / len(self.stages)) * 100), 95)
            bar_length = 30
            filled = int((progress / 100) * bar_length)
            bar = '█' * filled + '░' * (bar_length - filled)
            
            mins = self.elapsed // 10 // 60
            secs = (self.elapsed // 10) % 60
            time_str = f"{mins:02d}:{secs:02d}"
            
            sys.stdout.write('\r' + ' ' * 100 + '\r')
            sys.stdout.write(
                f"  {self.ORANGE}{frame}{self.RESET} "
                f"{self.BOLD}{self.filename}{self.RESET} "
                f"{self.CYAN}[{bar}]{self.RESET} "
                f"{self.ORANGE}{progress}%{self.RESET} "
                f"{self.DIM}({time_str}){self.RESET}\n"
                f"  {self.DIM}└─ {stage}...{self.RESET}"
            )
            sys.stdout.flush()
            sys.stdout.write('\033[F')
            
            frame_idx += 1
            self.elapsed += 1
            time.sleep(0.1)
    
    def stop(self, success=True):
        """Stop progress tracking"""
        self.running = False
        if self.thread:
            self.thread.join()
        
        sys.stdout.write('\r' + ' ' * 100 + '\r')
        sys.stdout.write('\033[F\r' + ' ' * 100 + '\r')
        
        if success:
            sys.stdout.write(
                f"  {self.GREEN}✓{self.RESET} "
                f"{self.BOLD}{self.filename}{self.RESET} "
                f"{self.GREEN}[{'█' * 30}]{self.RESET} "
                f"{self.GREEN}100%{self.RESET} "
                f"{self.DIM}Complete{self.RESET}\n"
            )
        else:
            sys.stdout.write(
                f"  {self.YELLOW}!{self.RESET} "
                f"{self.BOLD}{self.filename}{self.RESET} "
                f"{self.YELLOW}Analysis incomplete{self.RESET}\n"
            )
        sys.stdout.flush()

@cli.group()
def pip():
    """Python package management with security scanning"""
    pass

@pip.command()
@click.argument('package')
def install(package):
    """Scan and install a Python package safely"""
    from pluto.scanners.pip_scanner import PipScanner
    
    scanner = PipScanner(package)
    
    try:
        # Scan package
        if not scanner.scan():
            return
        
        # Ask for confirmation
        if scanner.should_install():
            scanner.install()
        else:
            print("Installation cancelled.")
    finally:
        scanner.cleanup()

@cli.group()
def npm():
    """NPM package management with security scanning"""
    pass

@npm.command()
@click.argument('package')
def install(package):
    """Scan and install an NPM package safely"""
    from pluto.scanners.npm_scanner import NpmScanner
    
    scanner = NpmScanner(package)
    
    try:
        if not scanner.scan():
            return
        
        if scanner.should_install():
            scanner.install()
        else:
            print("Installation cancelled.")
    finally:
        scanner.cleanup()

@cli.command()
@click.option('-code', '--code-file', type=click.Path(exists=True), help='Analyze a single code file')
@click.option('-dir', '--directory', type=click.Path(exists=True), help='Analyze entire directory')
@click.option('-git', '--git-repo', type=str, help='Analyze GitHub repository')
@click.option('--provider', type=click.Choice(['claude', 'openai', 'ollama']), default=None, help='AI provider')
@click.option('--model', type=str, default=None, help='Model name')
@click.option('--report', type=click.Choice(['terminal', 'pdf', 'json', 'markdown']), default='terminal', help='Report format')
@click.option('--output', type=str, default='pluto_report', help='Output file name')
@click.option('--min-severity', type=click.Choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), default='LOW', help='Minimum severity')
@click.option('--no-banner', is_flag=True, help='Skip banner')
@click.option('--no-progress', is_flag=True, help='Skip progress bar')
def scan(code_file, directory, git_repo, provider, model, report, output, min_severity, no_banner, no_progress):
    """Scan code for security vulnerabilities"""
    from pluto.utils.setup_wizard import SetupWizard
    from pluto.utils.banner import AnimatedBanner
    from pluto.analyzers.code_analyzer import CodeAnalyzer
    from pluto.reporters.terminal_reporter import TerminalReporter
    from pluto.reporters.pdf_reporter import PDFReporter
    from pluto.reporters.json_reporter import JSONReporter
    from pluto.reporters.markdown_reporter import MarkdownReporter
    
    if not no_banner:
        AnimatedBanner.scan_header()
    
    config = SetupWizard.load_config()
    
    if not provider and config:
        provider = config.get('provider', 'claude')
    elif not provider:
        provider = 'claude'
    
    if not model and config:
        model = config.get('model', 'claude-sonnet-4-20250514')
    elif not model:
        model = 'claude-sonnet-4-20250514' if provider == 'claude' else 'gpt-4' if provider == 'openai' else 'phi'
    
    if config and config.get('api_key'):
        if provider == 'claude':
            os.environ['ANTHROPIC_API_KEY'] = config['api_key']
        elif provider == 'openai':
            os.environ['OPENAI_API_KEY'] = config['api_key']
    
    try:
        analyzer = CodeAnalyzer(provider=provider, model=model)
    except Exception as e:
        AnimatedBanner.show_error(str(e))
        return
    
    files_to_analyze = []
    
    if code_file:
        files_to_analyze.append(code_file)
    elif directory:
        files_to_analyze = get_code_files(directory)
    elif git_repo:
        click.echo("  📦 Cloning repository...")
        from pluto.analyzers.git_analyzer import GitAnalyzer
        git_analyzer = GitAnalyzer()
        repo_path = git_analyzer.clone_repo(git_repo)
        files_to_analyze = get_code_files(repo_path)
    else:
        click.echo("❌ Error: Please specify -code, -dir, or -git")
        return
    
    if not files_to_analyze:
        click.echo("❌ No code files found")
        return
    
    click.echo(f"  📂 Found {len(files_to_analyze)} file(s) to analyze\n")
    
    all_results = []
    
    for file_path in files_to_analyze:
        filename = Path(file_path).name
        
        if no_progress:
            AnimatedBanner.animate_scanning(filename)
        else:
            tracker = AIProgressTracker()
            tracker.start(filename)
        
        try:
            results = analyzer.analyze_file(file_path)
            
            if not no_progress:
                tracker.stop(success=True)
            
            if results:
                all_results.extend(results)
                
        except Exception as e:
            if not no_progress:
                tracker.stop(success=False)
            
            error_msg = str(e)
            if "Error calling" in error_msg:
                print()
                AnimatedBanner.show_error(error_msg)
                return
    
    severity_order = {'LOW': 0, 'MEDIUM': 1, 'HIGH': 2, 'CRITICAL': 3}
    min_level = severity_order[min_severity]
    filtered_results = [r for r in all_results if severity_order.get(r.get('severity', 'LOW'), 0) >= min_level]
    
    print()
    
    if report == 'terminal':
        reporter = TerminalReporter()
        reporter.generate(filtered_results)
    
    if report == 'pdf':
        reporter = PDFReporter()
        reporter.generate(filtered_results, f"{output}.pdf")
        click.echo(f"\n  ✓ PDF report: {output}.pdf")
    
    if report == 'json':
        reporter = JSONReporter()
        reporter.generate(filtered_results, f"{output}.json")
        click.echo(f"\n  ✓ JSON report: {output}.json")
    
    if report == 'markdown':
        reporter = MarkdownReporter()
        reporter.generate(filtered_results, f"{output}.md")
        click.echo(f"\n  ✓ Markdown report: {output}.md")

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
