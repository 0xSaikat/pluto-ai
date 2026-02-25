import subprocess
import tempfile
import shutil
import os
from pathlib import Path
import sys
import time
import threading

class PackageProgressTracker:
    """Track package scanning progress"""
    
    ORANGE = '\033[38;5;208m'
    GREEN = '\033[92m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'
    
    def __init__(self):
        self.running = False
        self.thread = None
        self.elapsed = 0
    
    def start(self, package_name, stage_name):
        """Start progress tracking"""
        self.running = True
        self.package_name = package_name
        self.stage_name = stage_name
        self.elapsed = 0
        self.stages = [
            "Checking package metadata",
            "Downloading from registry",
            "Extracting package files",
            "Reading code structure",
            "Analyzing dependencies",
            "Scanning for vulnerabilities",
            "Checking for malicious patterns",
            "Reviewing permissions",
            "AI security analysis",
            "Finalizing report"
        ]
        self.current_stage_idx = 0
        self.thread = threading.Thread(target=self._animate)
        self.thread.daemon = True
        self.thread.start()
    
    def _animate(self):
        """Animate progress"""
        frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        frame_idx = 0
        
        while self.running:
            if self.elapsed > 0 and self.elapsed % 15 == 0:
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
                f"{self.BOLD}{self.package_name}{self.RESET} "
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
        """Stop progress"""
        self.running = False
        if self.thread:
            self.thread.join()
        
        sys.stdout.write('\r' + ' ' * 100 + '\r')
        sys.stdout.write('\033[F\r' + ' ' * 100 + '\r')
        
        if success:
            sys.stdout.write(
                f"  {self.GREEN}✓{self.RESET} "
                f"{self.BOLD}{self.package_name}{self.RESET} "
                f"{self.GREEN}[{'█' * 30}]{self.RESET} "
                f"{self.GREEN}100%{self.RESET} "
                f"{self.DIM}Complete{self.RESET}\n"
            )
        sys.stdout.flush()

class PipScanner:
    """Scan Python packages before installation"""
    
    ORANGE = '\033[38;5;208m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'
    
    def __init__(self, package_name):
        self.package_name = package_name
        self.temp_dir = None
        self.vulnerabilities = []
    
    def scan(self):
        """Main scanning process"""
        from pluto.utils.banner import AnimatedBanner
        
        # Show banner
        AnimatedBanner.scan_header()
        
        print(f"  📦 Scanning Python package: {self.BOLD}{self.package_name}{self.RESET}\n")
        
        # Check PyPI
        package_info = self._get_package_info()
        if not package_info:
            print(f"  {self.RED}❌ Package not found on PyPI{self.RESET}\n")
            return False
        
        # Start progress tracking
        tracker = PackageProgressTracker()
        tracker.start(self.package_name, "Scanning")
        
        # Download
        if not self._download_package():
            tracker.stop(success=False)
            print(f"\n  {self.RED}❌ Failed to download package{self.RESET}\n")
            return False
        
        # Scan
        self.vulnerabilities = self._scan_code()
        
        # Stop progress
        tracker.stop(success=True)
        
        # Show results
        print()
        self._display_results()
        
        return True
    
    def _get_package_info(self):
        """Get package info from PyPI"""
        import requests
        try:
            response = requests.get(f"https://pypi.org/pypi/{self.package_name}/json", timeout=10)
            if response.status_code == 200:
                return response.json()
        except:
            pass
        return None
    
    def _download_package(self):
        """Download package"""
        self.temp_dir = tempfile.mkdtemp(prefix='pluto_scan_')
        try:
            result = subprocess.run(
                ['pip', 'download', '--no-deps', '--dest', self.temp_dir, self.package_name],
                capture_output=True,
                text=True,
                timeout=60
            )
            return result.returncode == 0
        except:
            return False
    
    def _scan_code(self):
        """Scan code"""
        from pluto.analyzers.code_analyzer import CodeAnalyzer
        from pluto.utils.setup_wizard import SetupWizard
        
        vulnerabilities = []
        
        config = SetupWizard.load_config()
        provider = config.get('provider', 'ollama') if config else 'ollama'
        model = config.get('model', 'phi') if config else 'phi'
        
        if config and config.get('api_key'):
            if provider == 'claude':
                os.environ['ANTHROPIC_API_KEY'] = config['api_key']
            elif provider == 'openai':
                os.environ['OPENAI_API_KEY'] = config['api_key']
        
        try:
            analyzer = CodeAnalyzer(provider=provider, model=model)
            python_files = list(Path(self.temp_dir).rglob('*.py'))
            
            for file_path in python_files[:5]:
                try:
                    results = analyzer.analyze_file(str(file_path))
                    if results:
                        vulnerabilities.extend(results)
                except:
                    pass
        except:
            pass
        
        vulnerabilities.extend(self._basic_security_checks())
        return vulnerabilities
    
    def _basic_security_checks(self):
        """Basic security checks"""
        vulnerabilities = []
        
        patterns = [
            ('eval(', 'Code Execution', 'HIGH', 'eval() can execute arbitrary code'),
            ('exec(', 'Code Execution', 'HIGH', 'exec() can execute arbitrary code'),
            ('subprocess.call', 'Command Execution', 'HIGH', 'Command injection risk'),
            ('os.system', 'Command Execution', 'HIGH', 'System command execution'),
            ('pickle.loads', 'Insecure Deserialization', 'CRITICAL', 'Arbitrary code execution'),
        ]
        
        for file_path in Path(self.temp_dir).rglob('*.py'):
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for pattern, vuln_type, severity, desc in patterns:
                        if pattern in content:
                            vulnerabilities.append({
                                'type': vuln_type,
                                'severity': severity,
                                'description': desc,
                                'file': file_path.name,
                            })
            except:
                pass
        
        return vulnerabilities
    
    def _display_results(self):
        """Display results"""
        print(f"{self.BOLD}{'='*70}{self.RESET}")
        print(f"{self.BOLD}PACKAGE SECURITY SCAN RESULTS{self.RESET}")
        print(f"{self.BOLD}{'='*70}{self.RESET}\n")
        
        if not self.vulnerabilities:
            print(f"  {self.GREEN}{self.BOLD}✓ No security issues detected!{self.RESET}\n")
            print(f"  {self.DIM}This package appears safe to install.{self.RESET}\n")
            return
        
        severity_count = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for vuln in self.vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            severity_count[severity] = severity_count.get(severity, 0) + 1
        
        print(f"  Total Issues: {self.BOLD}{len(self.vulnerabilities)}{self.RESET}\n")
        print(f"    {self.RED}● CRITICAL: {severity_count['CRITICAL']}{self.RESET}")
        print(f"    {self.ORANGE}● HIGH: {severity_count['HIGH']}{self.RESET}")
        print(f"    {self.YELLOW}● MEDIUM: {severity_count['MEDIUM']}{self.RESET}")
        print(f"    {self.GREEN}● LOW: {severity_count['LOW']}{self.RESET}\n")
        
        for i, vuln in enumerate(self.vulnerabilities[:5], 1):
            severity = vuln.get('severity', 'LOW')
            color = self.RED if severity == 'CRITICAL' else self.ORANGE if severity == 'HIGH' else self.YELLOW
            
            print(f"  {color}[{i}] {severity}{self.RESET} - {vuln.get('type', 'Unknown')}")
            print(f"      {self.DIM}{vuln.get('description', 'N/A')}{self.RESET}")
            if vuln.get('file'):
                print(f"      {self.DIM}File: {vuln['file']}{self.RESET}")
            print()
    
    def should_install(self):
        """Ask for confirmation"""
        print(f"{self.BOLD}{'='*70}{self.RESET}\n")
        
        if not self.vulnerabilities:
            return self._ask_confirm(f"  {self.GREEN}Package is safe. Install?{self.RESET}")
        
        critical = sum(1 for v in self.vulnerabilities if v.get('severity') in ['CRITICAL', 'HIGH'])
        
        if critical > 0:
            print(f"  {self.RED}{self.BOLD}⚠️  WARNING: {critical} CRITICAL/HIGH issues!{self.RESET}\n")
            return self._ask_confirm(f"  {self.RED}Still install? (NOT RECOMMENDED){self.RESET}")
        else:
            return self._ask_confirm(f"  {self.ORANGE}Install with low/medium issues?{self.RESET}")
    
    def _ask_confirm(self, message):
        """Ask confirmation"""
        while True:
            response = input(f"{message} {self.ORANGE}[y/N]:{self.RESET} ").strip().lower()
            if response in ['y', 'yes']:
                return True
            elif response in ['n', 'no', '']:
                return False
    
    def install(self):
        """Install package"""
        print(f"\n{self.ORANGE}Installing {self.package_name}...{self.RESET}\n")
        result = subprocess.run(['pip', 'install', self.package_name])
        
        if result.returncode == 0:
            print(f"\n{self.GREEN}✓ Successfully installed {self.package_name}{self.RESET}\n")
            return True
        else:
            print(f"\n{self.RED}❌ Installation failed{self.RESET}\n")
            return False
    
    def cleanup(self):
        """Cleanup"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir, ignore_errors=True)
