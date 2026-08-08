const https = require('https');
const { analyzeCode: mockAnalyzeCode } = require('./mockAI.service');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * Call Google Gemini REST API directly using standard HTTPS request
 */
const callGeminiAPI = (prompt) => {
  return new Promise((resolve, reject) => {
    if (!GEMINI_API_KEY) {
      return reject(new Error('GEMINI_API_KEY not configured'));
    }

    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            return reject(new Error(json.error.message || 'Gemini API Error'));
          }
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('Empty response from Gemini API'));
          resolve(text);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

/**
 * Main code security analysis using Gemini AI or robust fallback
 */
const analyzeCodeWithAI = async (sourceCode, scanType) => {
  if (GEMINI_API_KEY) {
    try {
      const prompt = `You are Pluto AI, an expert code security static analysis engine.
Analyze the following source code for security vulnerabilities.
Return ONLY valid JSON with this exact schema (no markdown, no backticks):
{
  "vulnerabilities": [
    {
      "vulnerability_name": "string (e.g. SQL Injection)",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "cwe_id": "string (e.g. CWE-89)",
      "description": "string (detailed vulnerability description)",
      "recommendation": "string (actionable fix recommendation)"
    }
  ],
  "risk_score": number (0 to 100 based on severity)
}

Source code to analyze:
\`\`\`
${sourceCode.substring(0, 4000)}
\`\`\``;

      const responseText = await callGeminiAPI(prompt);
      // Clean JSON string
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const vulnerabilities = parsed.vulnerabilities || [];
      const riskScore = typeof parsed.risk_score === 'number' ? parsed.risk_score : 50;

      return {
        vulnerabilities,
        risk_score: riskScore,
        summary: {
          total: vulnerabilities.length,
          critical: vulnerabilities.filter((v) => v.severity === 'CRITICAL').length,
          high: vulnerabilities.filter((v) => v.severity === 'HIGH').length,
          medium: vulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
          low: vulnerabilities.filter((v) => v.severity === 'LOW').length,
        },
      };
    } catch (err) {
      console.warn('Gemini API call failed, using local security analyzer:', err.message);
    }
  }

  // Fallback to local analyzer if API key isn't provided or fails
  return mockAnalyzeCode(sourceCode, scanType);
};

/**
 * AI Vulnerability Auto-Fix code recommendation generator
 */
const generateVulnerabilityFix = async (vulnerability, sourceCode = '') => {
  if (GEMINI_API_KEY) {
    try {
      const prompt = `You are Pluto AI, a senior security software engineer.
Provide a safe, refactored code fix snippet for the following security vulnerability:
Vulnerability: ${vulnerability.vulnerability_name} (${vulnerability.cwe_id})
Severity: ${vulnerability.severity}
Description: ${vulnerability.description}
Current Recommendation: ${vulnerability.recommendation}

${sourceCode ? `Original Code Snippet:\n${sourceCode.substring(0, 1500)}` : ''}

Respond in clean text with:
1. Explanation of the fix
2. Refactored secure code snippet
3. Best practices to prevent this issue in future`;

      const fix = await callGeminiAPI(prompt);
      return fix;
    } catch (err) {
      console.warn('Gemini API error during fix generation:', err.message);
    }
  }

  // Smart fallback recommendation
  return `### 🛡️ Pluto AI Recommended Security Fix for ${vulnerability.vulnerability_name} (${vulnerability.cwe_id})

**Severity**: ${vulnerability.severity}

#### Problem
${vulnerability.description}

#### Recommended Secure Implementation
\`\`\`javascript
// Secure Pattern:
// 1. Sanitize & validate all external inputs before execution.
// 2. Use parameterized inputs / ORM query builders.
// 3. Store sensitive secrets in environment variables (.env).

// Example fix:
const secureHandler = (req, res) => {
  const sanitizedInput = req.body.data.replace(/[^a-zA-Z0-9]/g, "");
  // Execute safely...
};
\`\`\`

#### Prevention Checklist
- [x] Enable strict input validation middleware (\`express-validator\`)
- [x] Enforce authorization & authentication middleware on protected routes
- [x] Run regular dependency vulnerability scans (\`npm audit\`)`;
};

/**
 * AI Security Assistant Chat
 */
const chatWithAI = async (message, context = {}) => {
  if (GEMINI_API_KEY) {
    try {
      const prompt = `You are Pluto AI, an intelligent cybersecurity assistant integrated into the Pluto AI Code Security Analyzer platform.
Help the developer answer their security question. Keep answers concise, accurate, and practical.

Context:
${context.vulnerability ? `Discussing Vulnerability: ${context.vulnerability.vulnerability_name} (${context.vulnerability.cwe_id})` : ''}
${context.projectName ? `Project: ${context.projectName}` : ''}

User Message: ${message}`;

      const reply = await callGeminiAPI(prompt);
      return reply;
    } catch (err) {
      console.warn('Gemini API error in chat:', err.message);
    }
  }

  // Fallback response generator
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('sql') || lowerMsg.includes('injection')) {
    return 'SQL Injection (CWE-89) occurs when untrusted user input is directly concatenated into SQL queries. To fix it, always use parameterized queries (e.g. `db.query("SELECT * FROM users WHERE id = ?", [id])`) or an ORM like Sequelize.';
  } else if (lowerMsg.includes('xss') || lowerMsg.includes('scripting')) {
    return 'Cross-Site Scripting (CWE-79) allows attackers to inject client-side scripts. Fix it by encoding output rendered in HTML and using libraries like `DOMPurify` on user input.';
  } else if (lowerMsg.includes('secret') || lowerMsg.includes('password') || lowerMsg.includes('jwt')) {
    return 'Never hardcode credentials or secrets in source code (CWE-798). Store them in environment variables (`.env`) and load them using `dotenv`. Ensure `.env` is listed in `.gitignore`.';
  }

  return `Pluto AI Security Assistant: Thank you for your question regarding "${message}". To secure your application, make sure to implement proper input validation, enforce JWT authentication on sensitive endpoints, and keep dependencies updated.`;
};

module.exports = {
  analyzeCodeWithAI,
  generateVulnerabilityFix,
  chatWithAI,
};
