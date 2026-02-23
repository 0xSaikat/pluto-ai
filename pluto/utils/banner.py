import time
import sys

class AnimatedBanner:
    """Clean, professional animated banner with orange theme"""
    
    
    ORANGE = '\033[38;5;208m'
    COPPER = '\033[38;5;173m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'
    
    @staticmethod
    def clear_screen():
        """Clear terminal screen"""
        print('\033[2J\033[H', end='')
    
    @staticmethod
    def show_logo():
        """Display Pluto ASCII logo"""
        logo = f"""{AnimatedBanner.ORANGE}{AnimatedBanner.BOLD}
██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ 
{AnimatedBanner.RESET}"""
        print(logo)
        
        print(f"{AnimatedBanner.DIM}AI-Powered Code Security Analyzer{AnimatedBanner.RESET}")
        print(f"{AnimatedBanner.DIM}by hackbit · github.com/0xSaikat/pluto-ai{AnimatedBanner.RESET}\n")
    
    @staticmethod
    def check_dependency(name, check_func):
        """Check single dependency with animation"""
        sys.stdout.write(f"  {AnimatedBanner.ORANGE}✔{AnimatedBanner.RESET}  {name}")
        sys.stdout.flush()
        
        padding = 50 - len(name)
        sys.stdout.write(" " * padding)
        
        for _ in range(3):
            sys.stdout.write(f"{AnimatedBanner.DIM}.{AnimatedBanner.RESET}")
            sys.stdout.flush()
            time.sleep(0.1)
        
        try:
            result = check_func()
            if result:
                sys.stdout.write(f" {AnimatedBanner.GREEN}{AnimatedBanner.BOLD}OK{AnimatedBanner.RESET}\n")
            else:
                sys.stdout.write(f" {AnimatedBanner.RED}FAIL{AnimatedBanner.RESET}\n")
        except:
            sys.stdout.write(f" {AnimatedBanner.YELLOW}WARN{AnimatedBanner.RESET}\n")
        
        sys.stdout.flush()
        time.sleep(0.15)
    
    @staticmethod
    def check_requirements():
        """Check all requirements"""
        print(f"{AnimatedBanner.ORANGE}Checking requirements{AnimatedBanner.RESET} {AnimatedBanner.DIM}...{AnimatedBanner.RESET}\n")
        time.sleep(0.3)
        
        checks = [
            ("Python 3.7+", lambda: sys.version_info >= (3, 7)),
            ("Click (CLI framework)", lambda: __import__('click')),
            ("Anthropic SDK", lambda: __import__('anthropic')),
            ("OpenAI SDK", lambda: __import__('openai')),
            ("Requests", lambda: __import__('requests')),
            ("GitPython", lambda: __import__('git')),
            ("ReportLab (PDF)", lambda: __import__('reportlab')),
        ]
        
        for name, check_func in checks:
            AnimatedBanner.check_dependency(name, check_func)
        
        print()
    
    @staticmethod
    def show_initializing():
        """Show initializing animation"""
        bar_length = 20
        for i in range(bar_length + 1):
            sys.stdout.write(f"\r  {AnimatedBanner.ORANGE}✔{AnimatedBanner.RESET}  Initializing AI engine                              ")
            
            filled = '█' * i
            empty = '░' * (bar_length - i)
            percent = int((i / bar_length) * 100)
            
            sys.stdout.write(f"{AnimatedBanner.ORANGE}[{filled}{empty}]{AnimatedBanner.RESET} {percent}%")
            sys.stdout.flush()
            time.sleep(0.05)
        
        sys.stdout.write(f"\r  {AnimatedBanner.GREEN}✔{AnimatedBanner.RESET}  Initializing AI engine                              ")
        sys.stdout.write(f"{AnimatedBanner.GREEN}{AnimatedBanner.BOLD}READY{AnimatedBanner.RESET}      \n")
        sys.stdout.flush()
        print()
    
    @staticmethod
    def show_ready():
        """Show ready message"""
        print(f"{AnimatedBanner.GREEN}{AnimatedBanner.BOLD}🛡  Pluto is ready. Let's hunt some vulnerabilities.{AnimatedBanner.RESET}\n")
    
    @staticmethod
    def full_animation():
        """Complete startup animation"""
        AnimatedBanner.clear_screen()
        AnimatedBanner.show_logo()
        time.sleep(0.5)
        AnimatedBanner.check_requirements()
        time.sleep(0.3)
        AnimatedBanner.show_initializing()
        time.sleep(0.3)
        AnimatedBanner.show_ready()
    
    @staticmethod
    def scan_header():
        """Show scan header with logo"""
        AnimatedBanner.clear_screen()
        print()
        AnimatedBanner.show_logo()
    
    @staticmethod
    def animate_scanning(filename):
        """Animate file scanning"""
        frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        
        for i in range(15):
            frame = frames[i % len(frames)]
            sys.stdout.write(f"\r  {AnimatedBanner.ORANGE}{frame}{AnimatedBanner.RESET}  Scanning: {AnimatedBanner.BOLD}{filename}{AnimatedBanner.RESET}")
            sys.stdout.flush()
            time.sleep(0.1)
        
        sys.stdout.write(f"\r  {AnimatedBanner.GREEN}✓{AnimatedBanner.RESET}  Scanned: {AnimatedBanner.BOLD}{filename}{AnimatedBanner.RESET}                    \n")
        sys.stdout.flush()
    
    @staticmethod
    def show_error(error_msg):
        """Display error message nicely"""
        print()
        print(f"{AnimatedBanner.RED}{AnimatedBanner.BOLD}{'='*70}{AnimatedBanner.RESET}")
        print(f"{AnimatedBanner.RED}{AnimatedBanner.BOLD}  ⚠️  ERROR{AnimatedBanner.RESET}")
        print(f"{AnimatedBanner.RED}{AnimatedBanner.BOLD}{'='*70}{AnimatedBanner.RESET}")
        print()
        
        
        if "authentication_error" in error_msg or "invalid x-api-key" in error_msg:
            print(f"{AnimatedBanner.RED}Authentication Failed{AnimatedBanner.RESET}")
            print(f"\n{AnimatedBanner.YELLOW}Your API key is invalid or expired.{AnimatedBanner.RESET}\n")
            print(f"{AnimatedBanner.DIM}To fix this:{AnimatedBanner.RESET}")
            print(f"  1. Get a new API key from: https://console.anthropic.com/")
            print(f"  2. Run: {AnimatedBanner.BOLD}pluto --reset{AnimatedBanner.RESET}")
            print(f"  3. Or set environment variable:")
            print(f"     {AnimatedBanner.DIM}export ANTHROPIC_API_KEY='your-new-key'{AnimatedBanner.RESET}")
        elif "Connection" in error_msg or "timeout" in error_msg:
            print(f"{AnimatedBanner.RED}Connection Error{AnimatedBanner.RESET}")
            print(f"\n{AnimatedBanner.YELLOW}Could not connect to AI service.{AnimatedBanner.RESET}\n")
            print(f"{AnimatedBanner.DIM}Check your internet connection and try again.{AnimatedBanner.RESET}")
        else:
            print(f"{AnimatedBanner.RED}Unexpected Error{AnimatedBanner.RESET}")
            print(f"\n{AnimatedBanner.DIM}{error_msg}{AnimatedBanner.RESET}")
        
        print()
        print(f"{AnimatedBanner.RED}{AnimatedBanner.BOLD}{'='*70}{AnimatedBanner.RESET}")
        print()
