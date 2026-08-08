import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, removeToken } from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    total_scans: 0,
    threats_found: 0,
    safe_projects: 0,
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setStats(data.dashboard);
      } catch (err) {
        if (err.message.includes("token") || err.message.includes("Access denied")) {
          removeToken();
          navigate("/login");
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#00bcd4", fontSize: "18px" }}>Loading dashboard...</p>
      </div>
    );
  }

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
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: "14px" }}>
            Welcome, {user.full_name || "User"}
          </span>
          <button
            onClick={() => navigate("/analyzer")}
            style={{
              padding: "8px 16px", background: "#00bcd4",
              color: "#000", border: "none", borderRadius: "6px",
              cursor: "pointer", fontWeight: "bold", fontSize: "14px"
            }}
          >
            New Scan
          </button>
          <button
            onClick={() => navigate("/profile")}
            style={{
              padding: "8px 16px", background: "transparent",
              color: "#888", border: "1px solid #333", borderRadius: "6px",
              cursor: "pointer", fontSize: "14px"
            }}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px", background: "transparent",
              color: "#ff4444", border: "1px solid #ff4444", borderRadius: "6px",
              cursor: "pointer", fontSize: "14px"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "32px" }}>
        <h2 style={{ color: "#fff", marginBottom: "24px", fontSize: "28px" }}>
          Dashboard
        </h2>

        {error && (
          <div style={{
            background: "#1a0000", border: "1px solid #ff4444",
            color: "#ff4444", padding: "12px 16px",
            borderRadius: "8px", marginBottom: "24px"
          }}>
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{
            background: "#111", border: "1px solid #222",
            borderRadius: "12px", padding: "28px"
          }}>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 12px 0" }}>Total Scans</p>
            <p style={{ color: "#00bcd4", fontSize: "42px", fontWeight: "bold", margin: 0 }}>
              {stats.total_scans}
            </p>
          </div>

          <div style={{
            background: "#111", border: "1px solid #ff4444",
            borderRadius: "12px", padding: "28px"
          }}>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 12px 0" }}>Threats Found</p>
            <p style={{ color: "#ff4444", fontSize: "42px", fontWeight: "bold", margin: 0 }}>
              {stats.threats_found}
            </p>
          </div>

          <div style={{
            background: "#111", border: "1px solid #00c853",
            borderRadius: "12px", padding: "28px"
          }}>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 12px 0" }}>Safe Projects</p>
            <p style={{ color: "#00c853", fontSize: "42px", fontWeight: "bold", margin: 0 }}>
              {stats.safe_projects}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "#111", border: "1px solid #222",
          borderRadius: "12px", padding: "28px"
        }}>
          <h3 style={{ color: "#00bcd4", marginBottom: "20px", fontSize: "18px" }}>
            Recent Activity
          </h3>

          {stats.recent_activity.length === 0 ? (
            <p style={{ color: "#555", fontSize: "14px" }}>
              No activity yet. Run your first scan to get started.
            </p>
          ) : (
            stats.recent_activity.map((log, index) => (
              <div key={index} style={{
                display: "flex", alignItems: "center",
                gap: "12px", padding: "10px 0",
                borderBottom: index < stats.recent_activity.length - 1 ? "1px solid #1a1a1a" : "none"
              }}>
                <span style={{ color: "#00c853", fontSize: "16px" }}>✓</span>
                <div>
                  <p style={{ color: "#ddd", fontSize: "14px", margin: 0 }}>
                    {log.action}
                  </p>
                  <p style={{ color: "#555", fontSize: "12px", margin: "4px 0 0 0" }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;