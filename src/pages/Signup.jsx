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

  const validate = () => {
    if (!/^\d{10}$/.test(form.mobile)) return "Mobile number must be 10 digits";
    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
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

      setTimeout(() => navigate("/login"), 3000);
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

              <input
                className="auth-input"
                placeholder="Full Name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <input
                className="auth-input"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="auth-input"
                placeholder="Mobile Number (10 digits)"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />

              <textarea
                className="auth-input"
                placeholder="Full Delivery Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <input
                className="auth-input"
                type="password"
                placeholder="Password (min 8 chars)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <input
                className="auth-input"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />

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
            <p className="auth-success">{message}</p>
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
