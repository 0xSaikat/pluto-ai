// Mock AI Security Engine
// Simulates GPT-4o / Claude / Gemini vulnerability analysis
// Replace this service with real AI API calls in production

const mockVulnerabilities = [
  {
    vulnerability_name: 'SQL Injection',
    severity: 'CRITICAL',
    cwe_id: 'CWE-89',
    description:
      'User input is directly concatenated into SQL queries without sanitization. An attacker can manipulate the query to access, modify, or delete database records.',
    recommendation:
      'Use parameterized queries or prepared statements. Never concatenate user input directly into SQL strings. Use an ORM like Sequelize which handles this automatically.',
  },
  {
    vulnerability_name: 'Cross-Site Scripting (XSS)',
    severity: 'HIGH',
    cwe_id: 'CWE-79',
    description:
      'User-supplied data is rendered in the browser without proper encoding. Attackers can inject malicious scripts that execute in other users browsers.',
    recommendation:
      'Sanitize and encode all user input before rendering it in HTML. Use Content Security Policy headers. Use libraries like DOMPurify for client-side sanitization.',
  },
  {
    vulnerability_name: 'Hardcoded Credentials',
    severity: 'CRITICAL',
    cwe_id: 'CWE-798',
    description:
      'API keys, passwords, or secret tokens are hardcoded directly in the source code. If the code is shared or leaked, these credentials are immediately compromised.',
    recommendation:
      'Move all secrets to environment variables using a .env file. Never commit credentials to version control. Use a secrets manager for production environments.',
  },
  {
    vulnerability_name: 'Weak Password Hashing',
    severity: 'HIGH',
    cwe_id: 'CWE-916',
    description:
      'Passwords are stored using weak hashing algorithms such as MD5 or SHA1 which are vulnerable to rainbow table and brute force attacks.',
    recommendation:
      'Use bcrypt, Argon2, or PBKDF2 for password hashing. These algorithms are designed to be slow and include salting by default, making brute force attacks impractical.',
  },
  {
    vulnerability_name: 'Insecure Direct Object Reference',
    severity: 'HIGH',
    cwe_id: 'CWE-639',
    description:
      'The application exposes internal object references such as database IDs in URLs without verifying that the requesting user has permission to access that object.',
    recommendation:
      'Always verify that the authenticated user has permission to access the requested resource. Never trust user-supplied IDs without authorization checks.',
  },
  {
    vulnerability_name: 'Missing Authentication',
    severity: 'CRITICAL',
    cwe_id: 'CWE-306',
    description:
      'Sensitive endpoints or operations do not require authentication, allowing any user including unauthenticated attackers to access protected functionality.',
    recommendation:
      'Implement authentication middleware on all sensitive routes. Use JWT or session-based authentication and verify tokens on every protected request.',
  },
  {
    vulnerability_name: 'Command Injection',
    severity: 'CRITICAL',
    cwe_id: 'CWE-78',
    description:
      'User input is passed directly to system shell commands without sanitization. Attackers can execute arbitrary commands on the server.',
    recommendation:
      'Never pass user input to shell commands. Use language-specific libraries instead of shell commands. If shell execution is necessary, use strict allowlists for input validation.',
  },
  {
    vulnerability_name: 'Sensitive Data Exposure',
    severity: 'MEDIUM',
    cwe_id: 'CWE-200',
    description:
      'The application exposes sensitive information such as stack traces, internal paths, or configuration details in error messages or API responses.',
    recommendation:
      'Implement proper error handling that returns generic error messages to users. Log detailed errors server-side only. Never expose stack traces in production.',
  },
  {
    vulnerability_name: 'Cross-Site Request Forgery',
    severity: 'MEDIUM',
    cwe_id: 'CWE-352',
    description:
      'The application does not verify that requests originate from the legitimate user, allowing attackers to trick users into performing unintended actions.',
    recommendation:
      'Implement CSRF tokens for all state-changing operations. Use the SameSite cookie attribute. Verify the Origin and Referer headers on sensitive requests.',
  },
  {
    vulnerability_name: 'Insecure Dependency',
    severity: 'MEDIUM',
    cwe_id: 'CWE-1104',
    description:
      'The application uses third-party libraries or packages with known security vulnerabilities that have not been updated.',
    recommendation:
      'Regularly audit dependencies using tools like npm audit or Snyk. Keep all packages updated to their latest secure versions. Remove unused dependencies.',
  },
  {
    vulnerability_name: 'Path Traversal',
    severity: 'HIGH',
    cwe_id: 'CWE-22',
    description:
      'User input is used to construct file paths without proper validation, allowing attackers to access files outside the intended directory.',
    recommendation:
      'Validate and sanitize all file path inputs. Use path.resolve() and verify the result stays within the allowed directory. Never trust user-supplied file names directly.',
  },
  {
    vulnerability_name: 'Unvalidated Redirect',
    severity: 'LOW',
    cwe_id: 'CWE-601',
    description:
      'The application redirects users to URLs specified in request parameters without validation, enabling phishing attacks.',
    recommendation:
      'Validate all redirect URLs against an allowlist of trusted destinations. Avoid using user-supplied input for redirects when possible.',
  },
];

// Calculate risk score based on vulnerabilities found
const calculateRiskScore = (vulnerabilities) => {
  if (vulnerabilities.length === 0) return 0;

  const weights = {
    CRITICAL: 40,
    HIGH: 25,
    MEDIUM: 15,
    LOW: 5,
  };

  let totalScore = 0;

  vulnerabilities.forEach((vuln) => {
    totalScore += weights[vuln.severity] || 0;
  });

  // Cap at 100
  return Math.min(totalScore, 100);
};

// Main analysis function
// In production, replace this with real API calls to GPT-4o, Claude, Gemini
const analyzeCode = async (sourceCode, scanType) => {
  // Simulate AI processing time (1-3 seconds)
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 2000 + 1000)
  );

  // Randomly select 2 to 5 vulnerabilities to simulate different results
  const shuffled = mockVulnerabilities.sort(() => Math.random() - 0.5);
  const count = Math.floor(Math.random() * 4) + 2;
  const selectedVulnerabilities = shuffled.slice(0, count);

  const riskScore = calculateRiskScore(selectedVulnerabilities);

  return {
    vulnerabilities: selectedVulnerabilities,
    risk_score: riskScore,
    summary: {
      total: selectedVulnerabilities.length,
      critical: selectedVulnerabilities.filter((v) => v.severity === 'CRITICAL').length,
      high: selectedVulnerabilities.filter((v) => v.severity === 'HIGH').length,
      medium: selectedVulnerabilities.filter((v) => v.severity === 'MEDIUM').length,
      low: selectedVulnerabilities.filter((v) => v.severity === 'LOW').length,
    },
  };
};

module.exports = { analyzeCode };