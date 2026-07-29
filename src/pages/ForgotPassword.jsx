// src/pages/ForgotPassword.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { ModalContext } from "../context/ModalContext";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showAlert } = useContext(ModalContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      showAlert({
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/users/forgot", { email });

      showAlert({
        title: "Link Sent",
        message: res.data.message || "A password reset link has been sent to your email.",
        type: "success",
        onConfirm: () => navigate("/login")
      });

      setEmail("");
    } catch (err) {
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to process request.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Sri Gayathri Religious</h1>
        <h2 className="auth-heading">Forgot Password</h2>

        <p className="auth-text">
          Enter your registered email and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              className={`auth-input ${email ? (isEmailValid ? "valid-input" : "invalid-input") : ""}`}
              type="email"
              placeholder="Registered Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-links" style={{ marginTop: 20 }}>
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
