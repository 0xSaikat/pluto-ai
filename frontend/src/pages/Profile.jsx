import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../api";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
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

      <div style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ color: "#fff", marginBottom: "32px" }}>My Profile</h2>

        <div style={{
          background: "#111", border: "1px solid #222",
          borderRadius: "12px", padding: "32px", marginBottom: "24px"
        }}>
          {/* Avatar */}
          <div style={{
            width: "80px", height: "80px",
            background: "#00bcd4", borderRadius: "50%",
            display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: "24px",
            fontSize: "32px", fontWeight: "bold", color: "#000"
          }}>
            {user.full_name ? user.full_name[0].toUpperCase() : "U"}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#555", fontSize: "12px", margin: "0 0 4px 0" }}>Full Name</p>
            <p style={{ color: "#fff", fontSize: "16px", margin: 0 }}>
              {user.full_name || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#555", fontSize: "12px", margin: "0 0 4px 0" }}>Email</p>
            <p style={{ color: "#fff", fontSize: "16px", margin: 0 }}>
              {user.email || "N/A"}
            </p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <p style={{ color: "#555", fontSize: "12px", margin: "0 0 4px 0" }}>Role</p>
            <span style={{
              background: user.role === "admin" ? "#00bcd422" : "#33333322",
              color: user.role === "admin" ? "#00bcd4" : "#888",
              padding: "4px 12px", borderRadius: "12px", fontSize: "13px"
            }}>
              {user.role || "user"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "14px",
              background: "transparent", color: "#ff4444",
              border: "1px solid #ff4444", borderRadius: "8px",
              cursor: "pointer", fontSize: "15px", fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;