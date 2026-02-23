# 🛡️ Pluto - AI-Powered Code Security Analyzer

<div align="center">

![logo](assets/cover.png)

[![PyPI version](https://badge.fury.io/py/pluto-ai.svg)](https://badge.fury.io/py/pluto-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![Downloads](https://static.pepy.tech/badge/pluto-ai)](https://pepy.tech/project/pluto-ai)

**Pluto** is a powerful CLI tool that uses AI to detect security vulnerabilities in your code.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Examples](#-examples) • [Contributing](#-contributing)

</div>

---

## ✨ What's New in v1.1.0

- 🎨 **Beautiful Orange Theme** - Orange color scheme
- 📊 **Real-time Progress Bar** - See exactly what AI is analyzing with live updates
- ⏱️ **Time Tracking** - Know how long each scan takes
- 🎭 **Animated Analysis Stages** - 10 different stages shown in real-time
- 🛡️ **Enhanced Setup Wizard** - Beautiful interactive first-time configuration
- 💡 **Smart Error Messages** - Helpful troubleshooting tips when issues occur

## 🚀 Features

- 🤖 **Multiple AI Providers**: Claude, OpenAI, Ollama (local)
- 📁 **Flexible Input**: Analyze files, directories, or GitHub repositories
- 📊 **Multiple Report Formats**: Terminal, PDF, JSON, Markdown
- 🔒 **Privacy-First**: Local analysis with Ollama support
- 🎯 **Severity Filtering**: Focus on CRITICAL, HIGH, MEDIUM, or LOW issues
- 🌐 **Multi-Language Support**: Python, JavaScript, Java, C/C++, Go, Rust, PHP, Ruby, and more
- ⚡ **Real-time Progress**: Live updates showing what AI is analyzing
- 🎨 **Beautiful UI**: Modern orange theme with animated elements

## 🔍 Security Checks

Pluto detects:
- 💉 SQL Injection
- 🔓 XSS (Cross-Site Scripting)
- 🔑 Authentication/Authorization flaws
- 🔐 Hardcoded secrets & credentials
- 🛡️ Insecure cryptography
- 📂 Path traversal
- ⚡ Command injection
- 🔒 CSRF vulnerabilities
- 📦 Insecure dependencies
- And many more...

## 📦 Installation

### From PyPI (Recommended)
```bash
pip install pluto-ai
```

### Upgrade to Latest Version
```bash
pip install --upgrade pluto-ai
```

### From Source
```bash
git clone https://github.com/0xSaikat/pluto-ai.git
cd pluto-ai
pip install -e .
```

## ⚙️ First-Time Setup

When you run Pluto for the first time, you'll be guided through an interactive setup:
```bash
pluto
```

The setup wizard will help you:
1. Choose your AI provider (Claude, OpenAI, or Ollama)
2. Select the best model for your needs
3. Configure API keys (if using cloud providers)
4. Verify your installation

## 💻 Usage

### Basic Commands
```bash
# First run - interactive setup
pluto

# Analyze a single file
pluto scan -code app.py

# Analyze entire directory with progress tracking
pluto scan -dir ./src

# Analyze GitHub repository
pluto scan -git https://github.com/user/repo

# Generate PDF report
pluto scan -code app.py --report pdf --output security_audit

# Use specific provider
pluto scan -code app.py --provider ollama --model phi

# Filter by severity
pluto scan -dir ./src --min-severity HIGH

# Reset configuration
pluto --reset
```

### Command Options
```
Options:
  -code, --code-file PATH           Analyze a single code file
  -dir, --directory PATH            Analyze entire directory
  -git, --git-repo TEXT             Analyze GitHub repository
  --provider [claude|openai|ollama] AI provider
  --model TEXT                      Model name
  --report [terminal|pdf|json|markdown]  Report format
  --output TEXT                     Output file name
  --min-severity [LOW|MEDIUM|HIGH|CRITICAL]  Minimum severity
  --no-progress                     Disable progress bar
  --no-banner                       Skip animated banner
  --reset                           Reset configuration
  --help                            Show help message
```

## 📚 Examples

### Quick Security Scan
```bash
pluto scan -code myapp.py
```

### Full Project Audit with PDF Report
```bash
pluto scan -dir ./backend --report pdf --output project_audit
```

### GitHub Repository Analysis
```bash
pluto scan -git https://github.com/user/vulnerable-app --report json
```

### Local Private Scan (No API Required)
```bash
pluto scan -code sensitive_code.py --provider ollama --model phi
```

### CI/CD Integration
```bash
pluto scan -dir ./src --report json --output results.json --min-severity HIGH --no-banner --no-progress
```

### Multiple Files Analysis
```bash
pluto scan -dir ./app --min-severity CRITICAL --report markdown --output critical_issues
```

## 📊 Report Formats

- **Terminal**: Colorful real-time output with severity highlighting and progress tracking
- **PDF**: Professional report with logo, charts, severity breakdown, and detailed findings
- **JSON**: Machine-readable format perfect for automation and CI/CD pipelines
- **Markdown**: Documentation-friendly format for GitHub issues and wikis

## 🎨 Supported Languages

Python • JavaScript • TypeScript • Java • C/C++ • Go • Rust • PHP • Ruby • Swift • Kotlin

## 🤖 AI Providers

### Claude (Anthropic) - Recommended
```bash
# Get API key from: https://console.anthropic.com/
export ANTHROPIC_API_KEY='sk-ant-...'
pluto scan -code app.py --provider claude
```

### OpenAI
```bash
# Get API key from: https://platform.openai.com/api-keys
export OPENAI_API_KEY='sk-...'
pluto scan -code app.py --provider openai
```

### Ollama (Local & Free)
```bash
# Install from: https://ollama.ai
ollama pull phi
ollama serve
pluto scan -code app.py --provider ollama --model phi
```

## 🎯 Advanced Features

### Real-time Progress Tracking
See exactly what AI is analyzing:
```
⠋ app.py [████████████░░░░░░░░░░░░░░░░░░] 45% (00:03)
└─ Checking for SQL injection...
```

### Smart Error Handling
Helpful error messages guide you through fixing issues:
```
⚠️  ERROR: Authentication Failed
Your API key is invalid or expired.

To fix this:
  1. Get a new API key from: https://console.anthropic.com/
  2. Run: pluto --reset
  3. Or set: export ANTHROPIC_API_KEY='your-new-key'
```

### Interactive Setup
Beautiful wizard guides you through configuration:
```
Step 1: Select AI Provider
  🤖 [1] Claude (Anthropic) - Best quality
  🧠 [2] OpenAI (GPT) - High quality  
  🏠 [3] Ollama (Local) - Free & private
```

## 🔧 Configuration File

Pluto saves your preferences at `~/.pluto/config.json`:
```json
{
  "provider": "claude",
  "model": "claude-sonnet-4-20250514",
  "api_key": "sk-ant-...",
  "setup_complete": true
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## 👨‍💻 Author

**0xSaikat**
- Website: [pluto.hackbit.org](https://pluto.hackbit.org)
- GitHub: [@0xSaikat](https://github.com/0xSaikat)
- Twitter: [@0xSaikat](https://twitter.com/0xSaikat)

## 🎖️ Acknowledgments

- Powered by Claude (Anthropic), OpenAI, and Ollama
- Built with ❤️ for the security community
- Special thanks to all contributors and users

## ⚠️ Disclaimer

Pluto is a security analysis tool intended for educational and legitimate security testing purposes only. Always ensure you have permission before scanning code or repositories you don't own.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**By the Hackers for the Hackers!**

<a href="https://github.com/0xSaikat"><img src="https://img.shields.io/badge/GitHub-0xSaikat-181717?style=for-the-badge&logo=github" alt="GitHub"></a>
<a href="https://twitter.com/0xSaikat"><img src="https://img.shields.io/badge/Twitter-0xSaikat-1DA1F2?style=for-the-badge&logo=twitter" alt="Twitter"></a>
<a href="https://pluto.hackbit.org"><img src="https://img.shields.io/badge/Web-hackbit.org-FF6B35?style=for-the-badge&logo=safari" alt="Web"></a>

**⭐ Star us on GitHub — it helps!**

</div>
