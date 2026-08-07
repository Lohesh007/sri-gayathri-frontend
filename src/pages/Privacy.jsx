import React from "react";
import "../styles/AboutContact.css";

const Privacy = () => {
  return (
    <div className="contact-page-wrapper">
      <div className="about-hero">
        <h1>Privacy Policy</h1>
        <p>Effective Date: August 2026</p>
      </div>

      <div className="about-content" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>1. Information We Collect</h2>
          <p>
            When you register on our store or make a purchase, we collect the personal details you provide: name, email address, mobile number, shipping address, and delivery instructions. 
            This information is used strictly to process orders and contact you regarding shipping updates.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>2. Payment Security</h2>
          <p>
            Your payment card, UPI, or net banking information is not stored by us. All payment processing is handled securely by Razorpay in compliance with Payment Card Industry Data Security Standards (PCI-DSS).
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>3. Data Protection</h2>
          <p>
            We take reasonable physical and electronic security precautions to protect your personal details from unauthorized access, loss, or disclosure. We do not sell or trade your details to third parties.
          </p>
        </div>

        <div className="about-card" style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>4. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us:
            <br />
            <b>Email:</b> loheshwaran311@gmail.com
            <br />
            <b>Phone:</b> +91 95975 80853
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
