import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, saveToken } from "../api";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(formData);
      saveToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
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
          Create Account
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
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

          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{ color: "#888", textAlign: "center", marginTop: "24px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00bcd4", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;