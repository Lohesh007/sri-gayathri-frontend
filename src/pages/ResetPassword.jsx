// src/pages/ResetPassword.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { ModalContext } from "../context/ModalContext";
import "../styles/Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useContext(ModalContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenError, setTokenError] = useState("");

  const criteria = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const matchesConfirm = password !== "" && password === confirmPassword;

  // Verify Reset Token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get(`/users/reset/${token}`);
        setTokenValidating(false);
      } catch (err) {
        setTokenError(
          err.response?.data?.message || "This reset link is invalid or has already been used."
        );
        setTokenValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  // Password Strength Score
  const getPasswordStrength = () => {
    if (!password) return { label: "", class: "", score: 0 };
    let score = 0;
    if (criteria.length) score++;
    if (criteria.number) score++;
    if (criteria.special) score++;

    if (score <= 1) return { label: "Weak 🔴", class: "strength-weak", score };
    if (score === 2) return { label: "Medium 🟡", class: "strength-medium", score };
    return { label: "Strong 🟢", class: "strength-strong", score };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!criteria.length || !criteria.number || !criteria.special) {
      showAlert({
        title: "Complexity Check",
        message: "Please meet all password requirements before resetting.",
        type: "error"
      });
      return;
    }

    if (!matchesConfirm) {
      showAlert({
        title: "Match Mismatch",
        message: "Confirm password does not match.",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);

      await API.post(`/users/reset/${token}`, { password });

      showAlert({
        title: "Success",
        message: "Password updated successfully!",
        type: "success",
        onConfirm: () => navigate("/login")
      });
    } catch (err) {
      showAlert({
        title: "Reset Failed",
        message: err.response?.data?.message || "Reset failed",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValidating) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Sri Gayathri Religious</h1>
          <h2 className="auth-heading">Validating Link...</h2>
          <div className="auth-loader"></div>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Sri Gayathri Religious</h1>
          <h2 className="auth-heading error">Link Invalid</h2>
          <p className="auth-text">{tokenError}</p>
          <button className="auth-btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Sri Gayathri Religious</h1>
        <h2 className="auth-heading">Reset Password</h2>

        <p className="auth-text">
          Set a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              className={`auth-input password ${password ? (criteria.length && criteria.number && criteria.special ? "valid-input" : "invalid-input") : ""}`}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {password && (
            <div className="password-feedback-panel">
              <div className="strength-meter-bar">
                <div className={`bar-fill ${strength.class}`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
              </div>
              <span className="strength-label">Strength: <strong>{strength.label}</strong></span>

              <ul className="criteria-list">
                <li className={criteria.length ? "met" : "unmet"}>
                  {criteria.length ? "✔" : "○"} At least 8 characters
                </li>
                <li className={criteria.number ? "met" : "unmet"}>
                  {criteria.number ? "✔" : "○"} Contains at least 1 number
                </li>
                <li className={criteria.special ? "met" : "unmet"}>
                  {criteria.special ? "✔" : "○"} Contains at least 1 special char
                </li>
              </ul>
            </div>
          )}

          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`auth-input password ${confirmPassword ? (matchesConfirm ? "valid-input" : "invalid-input") : ""}`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {confirmPassword && (
            <div className={`confirm-match-label ${matchesConfirm ? "success" : "error"}`}>
              {matchesConfirm ? "✔ Passwords match" : "❌ Passwords do not match"}
            </div>
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="auth-links">
          Back to <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
