import subprocess
import tempfile
import shutil
import os
from pathlib import Path
import sys
import time
import threading

class NpmScanner:
    """Scan NPM packages before installation"""
    
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
        """Scan NPM package"""
        from pluto.utils.banner import AnimatedBanner
        from pluto.scanners.pip_scanner import PackageProgressTracker
        
        AnimatedBanner.scan_header()
        
        print(f"  📦 Scanning NPM package: {self.BOLD}{self.package_name}{self.RESET}\n")
        
        # Check npm
        try:
            subprocess.run(['npm', '--version'], capture_output=True, check=True)
        except:
            print(f"  {self.RED}❌ npm is not installed{self.RESET}\n")
            return False
        
        # Progress
        tracker = PackageProgressTracker()
        tracker.start(self.package_name, "Scanning")
        
        if not self._download_package():
            tracker.stop(success=False)
            print(f"\n  {self.RED}❌ Download failed{self.RESET}\n")
            return False
        
        self.vulnerabilities = self._scan_code()
        tracker.stop(success=True)
        
        print()
        self._display_results()
        return True
    
    def _download_package(self):
        """Download npm package"""
        self.temp_dir = tempfile.mkdtemp(prefix='pluto_npm_')
        try:
            result = subprocess.run(
                ['npm', 'pack', self.package_name],
                cwd=self.temp_dir,
                capture_output=True,
                timeout=60
            )
            return result.returncode == 0
        except:
            return False
    
    def _scan_code(self):
        """Scan code"""
        vulnerabilities = []
        patterns = [
            ('eval(', 'Code Execution', 'HIGH'),
            ('child_process', 'Command Execution', 'HIGH'),
            ('fs.readFile', 'File Access', 'MEDIUM'),
        ]
        
        for file_path in Path(self.temp_dir).rglob('*.js'):
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    for pattern, vuln_type, severity in patterns:
                        if pattern in content:
                            vulnerabilities.append({
                                'type': vuln_type,
                                'severity': severity,
                                'file': file_path.name,
                            })
            except:
                pass
        
        return vulnerabilities
    
    def _display_results(self):
        """Display results"""
        print(f"{self.BOLD}{'='*70}{self.RESET}")
        print(f"{self.BOLD}NPM PACKAGE SECURITY SCAN{self.RESET}")
        print(f"{self.BOLD}{'='*70}{self.RESET}\n")
        
        if not self.vulnerabilities:
            print(f"  {self.GREEN}✓ No issues found{self.RESET}\n")
        else:
            print(f"  {self.YELLOW}Found {len(self.vulnerabilities)} issues{self.RESET}\n")
    
    def should_install(self):
        """Confirm install"""
        response = input(f"  {self.ORANGE}Install {self.package_name}? [y/N]:{self.RESET} ")
        return response.lower() in ['y', 'yes']
    
    def install(self):
        """Install"""
        print(f"\n{self.ORANGE}Installing...{self.RESET}\n")
        result = subprocess.run(['npm', 'install', self.package_name])
        return result.returncode == 0
    
    def cleanup(self):
        """Cleanup"""
        if self.temp_dir:
            shutil.rmtree(self.temp_dir, ignore_errors=True)
