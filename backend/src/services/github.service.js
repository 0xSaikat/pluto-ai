const https = require('https');

/**
 * Parses GitHub URL into owner and repo name
 * e.g., https://github.com/0xSaikat/pluto-ai -> { owner: '0xSaikat', repo: 'pluto-ai' }
 */
const parseGitHubUrl = (url) => {
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const parts = cleanUrl.split('github.com/')[1]?.split('/');
    if (!parts || parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch (e) {
    return null;
  }
};

/**
 * Fetches raw content or repository files via GitHub API
 */
const fetchGitHubRepositoryContents = async (githubUrl) => {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub URL format');
  }

  const { owner, repo } = parsed;

  // Try fetching README or repository contents
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Pluto-AI-Security-Analyzer',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const options = { headers };

    https.get(apiUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', async () => {
        try {
          if (res.statusCode !== 200) {
            // Fallback: return mock message if API fails/rate limited
            return resolve(`// Repository: ${githubUrl}\n// Unable to fetch contents directly via GitHub API (HTTP ${res.statusCode}). Scanning repository metadata.`);
          }

          const items = JSON.parse(data);
          if (!Array.isArray(items)) {
            return resolve(`// Repository: ${githubUrl}`);
          }

          // Filter for code files (js, py, ts, java, cpp, html, css, json, etc.)
          const codeFiles = items.filter(
            (item) =>
              item.type === 'file' &&
              /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|go|php|rb|html|css|json|sql|sh)$/i.test(item.name)
          );

          if (codeFiles.length === 0) {
            return resolve(`// Repository: ${githubUrl}\n// Found ${items.length} files in repository root.`);
          }

          // Fetch up to 3 code files content
          let combinedCode = `// GitHub Repository: ${githubUrl}\n// Owner: ${owner} | Repo: ${repo}\n\n`;

          for (const file of codeFiles.slice(0, 3)) {
            if (file.download_url) {
              const fileContent = await new Promise((resFile) => {
                https.get(file.download_url, { headers: { 'User-Agent': 'Pluto-AI' } }, (res2) => {
                  let fData = '';
                  res2.on('data', (c) => (fData += c));
                  res2.on('end', () => resFile(fData));
                }).on('error', () => resFile(''));
              });
              combinedCode += `// --- File: ${file.name} ---\n${fileContent.substring(0, 2000)}\n\n`;
            }
          }

          resolve(combinedCode);
        } catch (err) {
          resolve(`// Repository: ${githubUrl}\n// Error parsing repository content.`);
        }
      });
    }).on('error', (err) => {
      resolve(`// Repository: ${githubUrl}\n// Network error fetching repository: ${err.message}`);
    });
  });
};

module.exports = { fetchGitHubRepositoryContents, parseGitHubUrl };
