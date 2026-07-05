import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, saveToken } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "12px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "420px"
      }}>
        <h2 style={{
          color: "#00bcd4",
          textAlign: "center",
          marginBottom: "32px",
          fontSize: "28px",
          fontWeight: "bold"
        }}>
          Welcome Back
        </h2>

        {error && (
          <div style={{
            background: "#1a0000",
            border: "1px solid #ff4444",
            color: "#ff4444",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#1a1a2e",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#1a1a2e",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#555" : "#00bcd4",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ color: "#888", textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#00bcd4", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;