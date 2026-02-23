import os
import json
import time
import sys
from pathlib import Path

class SetupWizard:
    """Interactive setup wizard for first-time users"""
    
    
    ORANGE = '\033[38;5;208m'  
    COPPER = '\033[38;5;173m'  
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
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
        logo = f"""{SetupWizard.ORANGE}{SetupWizard.BOLD}
██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ 
{SetupWizard.RESET}"""
        print(logo)
        
        print(f"{SetupWizard.DIM}AI-Powered Code Security Analyzer{SetupWizard.RESET}")
        print(f"{SetupWizard.DIM}by hackbit · github.com/0xSaikat/pluto-ai{SetupWizard.RESET}\n")
    
    @staticmethod
    def get_config_path():
        """Get config file path"""
        home = Path.home()
        config_dir = home / '.pluto'
        config_dir.mkdir(exist_ok=True)
        return config_dir / 'config.json'
    
    @staticmethod
    def config_exists():
        """Check if config exists"""
        return SetupWizard.get_config_path().exists()
    
    @staticmethod
    def load_config():
        """Load existing config"""
        config_path = SetupWizard.get_config_path()
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return None
    
    @staticmethod
    def save_config(config):
        """Save config to file"""
        config_path = SetupWizard.get_config_path()
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
    
    @staticmethod
    def show_welcome():
        """Show welcome message with logo"""
        SetupWizard.clear_screen()
        SetupWizard.show_logo()
        print(f"{SetupWizard.ORANGE}{SetupWizard.BOLD}{'='*60}{SetupWizard.RESET}")
        print(f"{SetupWizard.ORANGE}{SetupWizard.BOLD}  🛡️  FIRST-TIME SETUP{SetupWizard.RESET}")
        print(f"{SetupWizard.ORANGE}{SetupWizard.BOLD}{'='*60}{SetupWizard.RESET}")
        print()
        print(f"{SetupWizard.DIM}Let's configure Pluto for your environment.{SetupWizard.RESET}\n")
        time.sleep(0.5)
    
    @staticmethod
    def select_provider():
        """Interactive provider selection"""
        print(f"{SetupWizard.BOLD}{SetupWizard.ORANGE}Step 1: Select AI Provider{SetupWizard.RESET}\n")
        
        providers = [
            {
                'name': 'Claude (Anthropic)',
                'key': 'claude',
                'desc': 'Best quality, requires API key',
                'emoji': '🤖',
                'requires_key': True
            },
            {
                'name': 'OpenAI (GPT)',
                'key': 'openai',
                'desc': 'High quality, requires API key',
                'emoji': '🧠',
                'requires_key': True
            },
            {
                'name': 'Ollama (Local)',
                'key': 'ollama',
                'desc': 'Free, private, runs locally',
                'emoji': '🏠',
                'requires_key': False
            }
        ]
        
        for i, provider in enumerate(providers, 1):
            print(f"  {provider['emoji']}  {SetupWizard.ORANGE}[{i}]{SetupWizard.RESET} {SetupWizard.BOLD}{provider['name']}{SetupWizard.RESET}")
            print(f"      {SetupWizard.DIM}{provider['desc']}{SetupWizard.RESET}")
        
        print()
        while True:
            choice = input(f"{SetupWizard.ORANGE}Your choice (1-3):{SetupWizard.RESET} ").strip()
            if choice in ['1', '2', '3']:
                selected = providers[int(choice) - 1]
                print(f"\n  {SetupWizard.GREEN}✓{SetupWizard.RESET} Selected: {SetupWizard.BOLD}{selected['name']}{SetupWizard.RESET}\n")
                time.sleep(0.5)
                return selected
            print(f"{SetupWizard.RED}  Invalid choice. Please enter 1, 2, or 3.{SetupWizard.RESET}")
    
    @staticmethod
    def select_model(provider_key, provider_name):
        """Select model based on provider"""
        print(f"{SetupWizard.BOLD}{SetupWizard.ORANGE}Step 2: Select Model for {provider_name}{SetupWizard.RESET}\n")
        
        models = {
            'claude': [
                {'name': 'Claude Sonnet 4.5', 'key': 'claude-sonnet-4-20250514', 'desc': 'Balanced speed & quality (Recommended)'},
                {'name': 'Claude Opus 4.5', 'key': 'claude-opus-4-20250514', 'desc': 'Highest quality, slower'},
                {'name': 'Claude Haiku 4.5', 'key': 'claude-haiku-4-20250514', 'desc': 'Fastest, good quality'},
            ],
            'openai': [
                {'name': 'GPT-4', 'key': 'gpt-4', 'desc': 'Best quality (Recommended)'},
                {'name': 'GPT-4 Turbo', 'key': 'gpt-4-turbo-preview', 'desc': 'Fast and powerful'},
                {'name': 'GPT-3.5 Turbo', 'key': 'gpt-3.5-turbo', 'desc': 'Budget-friendly'},
            ],
            'ollama': [
                {'name': 'Phi', 'key': 'phi', 'desc': 'Good balance - 1.6GB RAM (Recommended)'},
                {'name': 'TinyLlama', 'key': 'tinyllama', 'desc': 'Smallest - 637MB RAM'},
                {'name': 'Gemma 2B', 'key': 'gemma:2b', 'desc': 'Quality - 1.4GB RAM'},
            ]
        }
        
        available_models = models.get(provider_key, [])
        
        for i, model in enumerate(available_models, 1):
            recommended = " ⭐" if "Recommended" in model['desc'] else ""
            print(f"  {SetupWizard.ORANGE}[{i}]{SetupWizard.RESET} {SetupWizard.BOLD}{model['name']}{SetupWizard.RESET}{recommended}")
            print(f"      {SetupWizard.DIM}{model['desc']}{SetupWizard.RESET}")
        
        print()
        while True:
            choice = input(f"{SetupWizard.ORANGE}Your choice (1-{len(available_models)}):{SetupWizard.RESET} ").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(available_models):
                selected = available_models[int(choice) - 1]
                print(f"\n  {SetupWizard.GREEN}✓{SetupWizard.RESET} Selected: {SetupWizard.BOLD}{selected['name']}{SetupWizard.RESET}\n")
                time.sleep(0.5)
                return selected['key']
            print(f"{SetupWizard.RED}  Invalid choice.{SetupWizard.RESET}")
    
    @staticmethod
    def get_api_key(provider_name):
        """Get API key from user"""
        print(f"{SetupWizard.BOLD}{SetupWizard.ORANGE}Step 3: API Key Required{SetupWizard.RESET}\n")
        
        if 'Claude' in provider_name:
            print(f"{SetupWizard.ORANGE}  Get your Claude API key from:{SetupWizard.RESET}")
            print(f"  {SetupWizard.BOLD}https://console.anthropic.com/{SetupWizard.RESET}\n")
        elif 'OpenAI' in provider_name:
            print(f"{SetupWizard.ORANGE}  Get your OpenAI API key from:{SetupWizard.RESET}")
            print(f"  {SetupWizard.BOLD}https://platform.openai.com/api-keys{SetupWizard.RESET}\n")
        
        print(f"{SetupWizard.DIM}  (Your API key will be stored locally at ~/.pluto/config.json){SetupWizard.RESET}\n")
        
        while True:
            api_key = input(f"{SetupWizard.ORANGE}Paste your API key (or 'skip' to set later):{SetupWizard.RESET} ").strip()
            
            if api_key.lower() == 'skip':
                print(f"\n{SetupWizard.YELLOW}⚠  Warning: You'll need to set the API key later using environment variables:{SetupWizard.RESET}")
                if 'Claude' in provider_name:
                    print(f"  {SetupWizard.DIM}export ANTHROPIC_API_KEY='your-key-here'{SetupWizard.RESET}\n")
                else:
                    print(f"  {SetupWizard.DIM}export OPENAI_API_KEY='your-key-here'{SetupWizard.RESET}\n")
                time.sleep(1)
                return None
            
            if len(api_key) > 20 and api_key.startswith(('sk-', 'sk-ant-')):
                print(f"\n  {SetupWizard.GREEN}✓{SetupWizard.RESET} API key saved\n")
                time.sleep(0.5)
                return api_key
            else:
                print(f"{SetupWizard.RED}  Invalid API key format. Should start with 'sk-' or 'sk-ant-'{SetupWizard.RESET}")
    
    @staticmethod
    def check_ollama():
        """Check if Ollama is installed"""
        print(f"{SetupWizard.BOLD}{SetupWizard.ORANGE}Step 3: Checking Ollama Installation{SetupWizard.RESET}\n")
        
        import subprocess
        try:
            result = subprocess.run(['ollama', 'list'], capture_output=True, timeout=5)
            if result.returncode == 0:
                print(f"  {SetupWizard.GREEN}✓ Ollama is installed and running!{SetupWizard.RESET}\n")
                time.sleep(0.5)
                return True
        except:
            pass
        
        print(f"  {SetupWizard.YELLOW}⚠  Ollama not detected on your system{SetupWizard.RESET}\n")
        print(f"{SetupWizard.DIM}  To install Ollama:{SetupWizard.RESET}")
        print(f"  1. Visit: {SetupWizard.BOLD}https://ollama.ai{SetupWizard.RESET}")
        print(f"  2. Download and install")
        print(f"  3. Run: {SetupWizard.BOLD}ollama pull phi{SetupWizard.RESET}")
        print(f"  4. Run: {SetupWizard.BOLD}ollama serve{SetupWizard.RESET}\n")
        time.sleep(1)
        return False
    
    @staticmethod
    def setup_complete(config):
        """Show setup complete message"""
        SetupWizard.clear_screen()
        SetupWizard.show_logo()
        print(f"{SetupWizard.GREEN}{SetupWizard.BOLD}{'='*60}{SetupWizard.RESET}")
        print(f"{SetupWizard.GREEN}{SetupWizard.BOLD}  ✓ SETUP COMPLETE!{SetupWizard.RESET}")
        print(f"{SetupWizard.GREEN}{SetupWizard.BOLD}{'='*60}{SetupWizard.RESET}")
        print()
        print(f"{SetupWizard.ORANGE}Your Configuration:{SetupWizard.RESET}\n")
        print(f"  • Provider: {SetupWizard.BOLD}{config['provider'].upper()}{SetupWizard.RESET}")
        print(f"  • Model: {SetupWizard.BOLD}{config['model']}{SetupWizard.RESET}")
        if config.get('api_key'):
            masked_key = config['api_key'][:10] + '...' + config['api_key'][-4:]
            print(f"  • API Key: {SetupWizard.GREEN}✓ Set ({masked_key}){SetupWizard.RESET}")
        else:
            print(f"  • API Key: {SetupWizard.YELLOW}Not set{SetupWizard.RESET}")
        print()
        print(f"{SetupWizard.DIM}Config saved to: ~/.pluto/config.json{SetupWizard.RESET}\n")
        time.sleep(1)
        
        print(f"{SetupWizard.ORANGE}Ready to scan! Try:{SetupWizard.RESET}")
        print(f"  {SetupWizard.BOLD}pluto scan -code yourfile.py{SetupWizard.RESET}\n")
        
        input(f"{SetupWizard.DIM}Press Enter to continue...{SetupWizard.RESET}")
    
    @staticmethod
    def run():
        """Run the setup wizard"""
        SetupWizard.show_welcome()
        
        selected_provider = SetupWizard.select_provider()
        selected_model = SetupWizard.select_model(
            selected_provider['key'], 
            selected_provider['name']
        )
        
        api_key = None
        if selected_provider['requires_key']:
            api_key = SetupWizard.get_api_key(selected_provider['name'])
            if api_key:
                if 'claude' in selected_provider['key']:
                    os.environ['ANTHROPIC_API_KEY'] = api_key
                elif 'openai' in selected_provider['key']:
                    os.environ['OPENAI_API_KEY'] = api_key
        else:
            SetupWizard.check_ollama()
        
        config = {
            'provider': selected_provider['key'],
            'model': selected_model,
            'api_key': api_key,
            'setup_complete': True
        }
        
        SetupWizard.save_config(config)
        SetupWizard.setup_complete(config)
        
        return config
