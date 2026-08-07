import React from "react";
import "../styles/AboutContact.css";

const Terms = () => {
  return (
    <div className="contact-page-wrapper">
      <div className="about-hero">
        <h1>Terms & Conditions</h1>
        <p>Effective Date: August 2026</p>
      </div>

      <div className="about-content" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>1. Introduction</h2>
          <p>
            Welcome to Sri Gayathri Fancy & Religious. By visiting our website and accessing the information, resources, services, products, and tools we provide, you agree to accept and adhere to the following terms and conditions.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>2. Product Listings & Pricing</h2>
          <p>
            We strive to provide accurate details and pictures of our religious and fancy products. However, due to screen variations and hand-craftsmanship, minor variations may exist. 
            We reserve the right to correct any typographical pricing errors or adjust availability details at any time.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>3. Secure Checkout</h2>
          <p>
            All checkout orders are securely processed through Razorpay. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
          </p>
        </div>

        <div className="about-card" style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>4. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
