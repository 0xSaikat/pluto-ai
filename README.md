# 🛡️ Pluto - AI-Powered Code Security Analyzer

<div align="center">

![logo](assets/cover.png)

[![PyPI version](https://badge.fury.io/py/pluto-security-scanner.svg)](https://badge.fury.io/py/pluto-security-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)

**Pluto** is a powerful CLI tool that uses AI to detect security vulnerabilities in your code.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Examples](#-examples) • [Contributing](#-contributing)

</div>

---

## 🚀 Features

- 💻 **Multiple AI Providers**: Claude, OpenAI, Ollama (local)
- 📁 **Flexible Input**: Analyze files, directories, or GitHub repositories
- 📊 **Multiple Report Formats**: Terminal, PDF, JSON, Markdown
- 🔒 **Privacy-First**: Local analysis with Ollama support
- 🎯 **Severity Filtering**: Focus on CRITICAL, HIGH, MEDIUM, or LOW issues
- 🌐 **Multi-Language Support**: Python, JavaScript, Java, C/C++, Go, Rust, PHP, Ruby, and more

## 🔍 Security Checks

Pluto detects:
- SQL Injection
- XSS (Cross-Site Scripting)
- Authentication/Authorization flaws
- Hardcoded secrets & credentials
- Insecure cryptography
- Path traversal
- Command injection
- CSRF vulnerabilities
- Insecure dependencies
- And many more...

## 📦 Installation

### From PyPI (Recommended)
```bash
pip install pluto-ai
```

### From Source
```bash
git clone https://github.com/0xsaikat/pluto.git
cd pluto
pip install -e .
```

## ⚙️ Setup

### For Claude (Recommended)
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```
Get your API key from: https://console.anthropic.com/

### For OpenAI
```bash
export OPENAI_API_KEY='your-api-key-here'
```

### For Ollama (Local, Free)
```bash
# Install Ollama from https://ollama.ai
ollama pull phi
ollama serve
```

## 💻 Usage

### Basic Commands

```bash
# Analyze a single file
pluto scan -code app.py

# Analyze entire directory
pluto scan -dir ./src --report pdf --output security_report

# Analyze GitHub repository
pluto scan -git https://github.com/user/repo --provider claude

# Use local AI (Ollama)
pluto scan -code app.py --provider ollama --model phi

# Filter by severity
pluto scan -dir ./src --min-severity HIGH
```

### Command Options

```
Options:
  -code, --code-file PATH         Analyze a single code file
  -dir, --directory PATH          Analyze entire directory
  -git, --git-repo TEXT           Analyze GitHub repository
  --provider [claude|openai|ollama]  AI provider (default: claude)
  --model TEXT                    Model name
  --report [terminal|pdf|json|markdown]  Report format (default: terminal)
  --output TEXT                   Output file name
  --min-severity [LOW|MEDIUM|HIGH|CRITICAL]  Minimum severity level
  --help                          Show this message and exit
```

## 📚 Examples

### Quick Security Scan
```bash
pluto scan -code myapp.py
```

### Full Project Audit
```bash
pluto scan -dir ./backend --provider claude --report pdf --output project_audit
```

### GitHub Repository Analysis
```bash
pluto scan -git https://github.com/user/vulnerable-app --report json
```

### Local Private Scan
```bash
pluto scan -code sensitive_code.py --provider ollama --model phi
```

### CI/CD Integration
```bash
pluto scan -dir ./src --report json --output results.json --min-severity HIGH
```

## 📊 Report Formats

- **Terminal**: Colorful, real-time output with severity highlighting
- **PDF**: Professional report with logo, charts, and detailed findings
- **JSON**: Machine-readable format for automation and CI/CD
- **Markdown**: Documentation-friendly format

## 🎨 Supported Languages

Python • JavaScript • TypeScript • Java • C/C++ • Go • Rust • PHP • Ruby • Swift • Kotlin

## 🔧 Configuration

Create a `.plutorc` file in your project root:

```yaml
provider: claude
model: claude-sonnet-4-20250514
min_severity: MEDIUM
report_format: pdf
output_dir: ./security-reports
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**0xSaikat**
- Website: [hackbit.org](https://hackbit.org)
- GitHub: [@0xsaikat](https://github.com/0xsaikat)

## Acknowledgments

- Powered by Claude (Anthropic), OpenAI, and Ollama
- Built with ❤️ for the security community

## ⚠️ Disclaimer

Pluto is a security analysis tool intended for educational and legitimate security testing purposes only. Always ensure you have permission before scanning code or repositories you don't own.

---

<div align="center">
Made with 🛡️ by 0xSaikat | <a href="https://hackbit.org">hackbit.org</a>
</div>

---

<h6 align="center">By the Hackers for the Hackers!</h6>

<div align="center">
  <a href="https://github.com/0xSaikat"><img src="https://img.icons8.com/material-outlined/30/808080/github.png" alt="GitHub"></a>
  <a href="https://twitter.com/0xSaikat"><img src="https://img.icons8.com/material-outlined/30/808080/twitter.png" alt="Twitter"></a>
  <a href="https://www.linkedin.com/in/0xsaikat/"><img src="https://img.icons8.com/material-outlined/30/808080/linkedin.png" alt="LinkedIn"></a>
  <a href="https://findme.hackbit.org"><img src="https://img.icons8.com/material-outlined/30/808080/internet.png" alt="Web"></a>
</div>

