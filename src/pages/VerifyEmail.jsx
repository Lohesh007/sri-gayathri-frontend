// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Auth.css";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        await API.get(`/users/verify-email/${token}`);
        setStatus("success");
        setMessage("✔ Email verified successfully! You can now login.");
      } catch (err) {
        setStatus("error");
        setMessage("❌ Invalid or expired verification link.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h1 className="auth-title">Sri Gayathri Religious</h1>

        {status === "loading" && (
          <>
            <h2 className="auth-heading">Verifying...</h2>
            <p className="auth-text">Please wait while we verify your email.</p>
            <div className="auth-loader"></div>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="auth-heading success">Email Verified</h2>
            <p className="auth-text">{message}</p>
            <button
              className="auth-btn"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="auth-heading error">Verification Failed</h2>
            <p className="auth-text">{message}</p>
            <button
              className="auth-btn"
              onClick={() => navigate("/signup")}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
