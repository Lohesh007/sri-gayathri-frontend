// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/users/forgot", { email });

      toast.success(res.data.message || "Reset link sent!", {
        position: "top-center",
      });

      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
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
          <input
            className="auth-input"
            type="email"
            placeholder="Registered Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-links" style={{ marginTop: 20 }}>
          Remember your password?{" "}
          <span onClick={() => window.location.href = "/login"}>Login</span>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
