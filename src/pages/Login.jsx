// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import API from "../api";
import "../styles/Auth.css";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const { showAlert } = useContext(ModalContext);

  const [form, setForm] = useState({
    credential: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "true") {
      showAlert({
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        type: "warning"
      });
      navigate("/login", { replace: true });
    }
  }, [location, showAlert, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.credential || !form.password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("Logging in...");

      const res = await API.post("/users/login", form);

      if (res.data.user?.isVerified === false) {
        setMessage("Please verify your email before logging in.");
        return;
      }

      login(res.data.user, res.data.token, rememberMe);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Top Logo */}
        <h1 className="auth-title">Sri Gayathri Religious</h1>
        <h2 className="auth-heading">Welcome Back</h2>

        {message && <p className="auth-message">{message}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Mobile Number"
              value={form.credential}
              onChange={(e) =>
                setForm({ ...form, credential: e.target.value })
              }
              className="auth-input"
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="auth-input password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="auth-extras-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </p>

          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
