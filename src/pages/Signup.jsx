// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // form | success
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time Validation Checks
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isMobileValid = /^\d{10}$/.test(form.mobile);

  const criteria = {
    length: form.password.length >= 8,
    number: /\d/.test(form.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  };

  const matchesConfirm = form.password !== "" && form.password === form.confirmPassword;

  // Password Strength Score
  const getPasswordStrength = () => {
    if (!form.password) return { label: "", class: "", score: 0 };
    let score = 0;
    if (criteria.length) score++;
    if (criteria.number) score++;
    if (criteria.special) score++;

    if (score <= 1) return { label: "Weak 🔴", class: "strength-weak", score };
    if (score === 2) return { label: "Medium 🟡", class: "strength-medium", score };
    return { label: "Strong 🟢", class: "strength-strong", score };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    if (!form.username) return "Full Name is required";
    if (!isEmailValid) return "Please enter a valid email address";
    if (!isMobileValid) return "Mobile number must be exactly 10 digits";
    if (!form.address) return "Delivery Address is required";
    if (!criteria.length) return "Password must be at least 8 characters long";
    if (!criteria.number || !criteria.special) return "Password must meet all complexity requirements";
    if (!matchesConfirm) return "Passwords do not match";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const errMsg = validate();
    if (errMsg) return setMessage(errMsg);

    try {
      setLoading(true);
      setMessage("Creating your account...");

      const res = await API.post("/users/register", form);

      setMessage(res.data.message || "Signup successful! Verify your email.");
      setStep("success");

      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Sri Gayathri Religious</h1>

        {step === "form" && (
          <>
            <h2 className="auth-heading">Create Account</h2>

            {message && <p className="auth-message">{message}</p>}

            <form onSubmit={handleSignup} className="auth-form">
              <div className="input-group">
                <input
                  className={`auth-input ${form.username ? "valid-input" : ""}`}
                  placeholder="Full Name"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  className={`auth-input ${form.email ? (isEmailValid ? "valid-input" : "invalid-input") : ""}`}
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  className={`auth-input ${form.mobile ? (isMobileValid ? "valid-input" : "invalid-input") : ""}`}
                  placeholder="Mobile Number (10 digits)"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <textarea
                  className={`auth-input ${form.address ? "valid-input" : ""}`}
                  placeholder="Full Delivery Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>

              <div className="input-group password-group">
                <input
                  className={`auth-input password ${form.password ? (criteria.length && criteria.number && criteria.special ? "valid-input" : "invalid-input") : ""}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 chars)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

              {form.password && (
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
                  className={`auth-input password ${form.confirmPassword ? (matchesConfirm ? "valid-input" : "invalid-input") : ""}`}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
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

              {form.confirmPassword && (
                <div className={`confirm-match-label ${matchesConfirm ? "success" : "error"}`}>
                  {matchesConfirm ? "✔ Passwords match" : "❌ Passwords do not match"}
                </div>
              )}

              <button className="auth-btn" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="auth-links">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </>
        )}

        {step === "success" && (
          <>
            <h2 className="auth-heading">Verify Your Email</h2>
            <p className="auth-message success">{message}</p>
            <p className="auth-text">
              Please check your inbox and click the verification link.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
