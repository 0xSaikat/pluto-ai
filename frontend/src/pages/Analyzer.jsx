import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, createScan, removeToken } from "../api";

function Analyzer() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [scanType, setScanType] = useState("paste");
  const [sourceContent, setSourceContent] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
      if (data.projects.length > 0) {
        setSelectedProject(data.projects[0].id);
      }
    } catch (err) {
      if (err.message.includes("token") || err.message.includes("Access denied")) {
        removeToken();
        navigate("/login");
      }
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError("Project name is required");
      return;
    }
    try {
      const data = await createProject({
        project_name: newProjectName,
        description: "Created from Analyzer"
      });
      setProjects([...projects, data.project]);
      setSelectedProject(data.project.id);
      setNewProjectName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScan = async () => {
    setError("");
    setResult(null);

    if (!selectedProject) {
      setError("Please select or create a project first");
      return;
    }

    if (scanType !== "github" && !sourceContent.trim()) {
      setError("Please enter source code to scan");
      return;
    }

    if (scanType === "github" && !githubUrl.trim()) {
      setError("Please enter a GitHub URL");
      return;
    }

    try {
      setLoading(true);
      const scanData = {
        project_id: parseInt(selectedProject),
        scan_type: scanType,
        ...(scanType !== "github" && { source_content: sourceContent }),
        ...(scanType === "github" && { github_url: githubUrl }),
      };

      const data = await createScan(scanData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: "#ff1744",
      HIGH: "#ff6d00",
      MEDIUM: "#ffd600",
      LOW: "#00c853",
    };
    return colors[severity] || "#888";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <div style={{
        background: "#111", borderBottom: "1px solid #222",
        padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center"
      }}>
        <h1 style={{ color: "#00bcd4", fontSize: "22px", margin: 0 }}>
          Code Security Analyzer
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "8px 16px", background: "transparent",
            color: "#888", border: "1px solid #333",
            borderRadius: "6px", cursor: "pointer", fontSize: "14px"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ color: "#fff", marginBottom: "8px" }}>Security Scanner</h2>
        <p style={{ color: "#555", marginBottom: "32px", fontSize: "14px" }}>
          Submit your source code for AI-powered security analysis
        </p>

        {error && (
          <div style={{
            background: "#1a0000", border: "1px solid #ff4444",
            color: "#ff4444", padding: "12px 16px",
            borderRadius: "8px", marginBottom: "24px", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {/* Project selection */}
        <div style={{
          background: "#111", border: "1px solid #222",
          borderRadius: "12px", padding: "24px", marginBottom: "20px"
        }}>
          <h3 style={{ color: "#00bcd4", marginBottom: "16px", fontSize: "16px" }}>
            1. Select Project
          </h3>

          {projects.length > 0 && (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                background: "#1a1a2e", border: "1px solid #333",
                borderRadius: "8px", color: "#fff",
                fontSize: "14px", marginBottom: "16px"
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.project_name}</option>
              ))}
            </select>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Or create new project..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{
                flex: 1, padding: "12px",
                background: "#1a1a2e", border: "1px solid #333",
                borderRadius: "8px", color: "#fff", fontSize: "14px"
              }}
            />
            <button
              onClick={handleCreateProject}
              style={{
                padding: "12px 20px", background: "#333",
                color: "#fff", border: "none",
                borderRadius: "8px", cursor: "pointer", fontSize: "14px"
              }}
            >
              Create
            </button>
          </div>
        </div>

        {/* Scan type */}
        <div style={{
          background: "#111", border: "1px solid #222",
          borderRadius: "12px", padding: "24px", marginBottom: "20px"
        }}>
          <h3 style={{ color: "#00bcd4", marginBottom: "16px", fontSize: "16px" }}>
            2. Select Scan Type
          </h3>

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            {["paste", "github"].map((type) => (
              <button
                key={type}
                onClick={() => setScanType(type)}
                style={{
                  padding: "10px 20px",
                  background: scanType === type ? "#00bcd4" : "#1a1a2e",
                  color: scanType === type ? "#000" : "#888",
                  border: "1px solid #333",
                  borderRadius: "8px", cursor: "pointer",
                  fontWeight: scanType === type ? "bold" : "normal",
                  fontSize: "14px", textTransform: "capitalize"
                }}
              >
                {type === "paste" ? "Paste Code" : "GitHub URL"}
              </button>
            ))}
          </div>

          {scanType === "github" ? (
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              style={{
                width: "100%", padding: "12px",
                background: "#1a1a2e", border: "1px solid #333",
                borderRadius: "8px", color: "#fff",
                fontSize: "14px", boxSizing: "border-box"
              }}
            />
          ) : (
            <textarea
              placeholder="Paste your source code here..."
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              rows={12}
              style={{
                width: "100%", padding: "12px",
                background: "#1a1a2e", border: "1px solid #333",
                borderRadius: "8px", color: "#fff",
                fontSize: "13px", fontFamily: "Courier New",
                resize: "vertical", boxSizing: "border-box"
              }}
            />
          )}
        </div>

        {/* Scan button */}
        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            width: "100%", padding: "16px",
            background: loading ? "#555" : "#00bcd4",
            color: "#000", border: "none",
            borderRadius: "10px", fontSize: "16px",
            fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "32px"
          }}
        >
          {loading ? "Analyzing code... please wait..." : "Run Security Scan"}
        </button>

        {/* Results */}
        {result && (
          <div>
            {/* Summary cards */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px", marginBottom: "24px"
            }}>
              {[
                { label: "Total", value: result.summary.total, color: "#00bcd4" },
                { label: "Critical", value: result.summary.critical, color: "#ff1744" },
                { label: "High", value: result.summary.high, color: "#ff6d00" },
                { label: "Medium", value: result.summary.medium, color: "#ffd600" },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "#111", border: `1px solid ${item.color}`,
                  borderRadius: "10px", padding: "20px", textAlign: "center"
                }}>
                  <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px 0" }}>
                    {item.label}
                  </p>
                  <p style={{ color: item.color, fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Risk score */}
            <div style={{
              background: "#111", border: "1px solid #222",
              borderRadius: "12px", padding: "20px",
              marginBottom: "24px", textAlign: "center"
            }}>
              <p style={{ color: "#888", fontSize: "14px", margin: "0 0 8px 0" }}>
                Overall Risk Score
              </p>
              <p style={{
                color: result.scan.risk_score > 70 ? "#ff1744" :
                       result.scan.risk_score > 40 ? "#ffd600" : "#00c853",
                fontSize: "48px", fontWeight: "bold", margin: 0
              }}>
                {result.scan.risk_score} / 100
              </p>
            </div>

            {/* Vulnerabilities list */}
            <div style={{
              background: "#111", border: "1px solid #222",
              borderRadius: "12px", padding: "24px"
            }}>
              <h3 style={{ color: "#fff", marginBottom: "20px" }}>
                Detected Vulnerabilities
              </h3>

              {result.vulnerabilities.map((vuln, index) => (
                <div key={index} style={{
                  background: "#0d0d0d",
                  border: `1px solid ${getSeverityColor(vuln.severity)}33`,
                  borderLeft: `4px solid ${getSeverityColor(vuln.severity)}`,
                  borderRadius: "8px", padding: "16px",
                  marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>
                      {vuln.vulnerability_name}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{
                        background: getSeverityColor(vuln.severity) + "22",
                        color: getSeverityColor(vuln.severity),
                        padding: "2px 10px", borderRadius: "12px", fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {vuln.severity}
                      </span>
                      <span style={{
                        background: "#222", color: "#888",
                        padding: "2px 10px", borderRadius: "12px", fontSize: "12px"
                      }}>
                        {vuln.cwe_id}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 8px 0" }}>
                    {vuln.description}
                  </p>
                  <p style={{ color: "#00c853", fontSize: "13px", margin: 0 }}>
                    ✓ {vuln.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyzer;