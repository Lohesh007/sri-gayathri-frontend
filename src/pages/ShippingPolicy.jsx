import React from "react";
import "../styles/AboutContact.css";

const ShippingPolicy = () => {
  return (
    <div className="contact-page-wrapper">
      <div className="about-hero">
        <h1>Shipping & Delivery Policy</h1>
        <p>Effective Date: August 2026</p>
      </div>

      <div className="about-content" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>1. Shipping Rates & Destinations</h2>
          <p>
            We ship to addresses across India. Shipping charges are calculated dynamically at checkout based on the total order value and packaging dimensions.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>2. Processing Time</h2>
          <p>
            All orders are processed and verified within <b>1 to 2 business days</b>. Orders are not processed, shipped, or delivered on Sundays or national holidays.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>3. Shipment Timelines</h2>
          <p>
            Once shipped, orders typically take <b>3 to 7 business days</b> to reach destinations across India depending on the courier routing. 
            A tracking number will be provided via email or SMS once your shipment is dispatched.
          </p>
        </div>

        <div className="about-card" style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>4. Delivery Problems</h2>
          <p>
            If you encounter delays or issues with delivery, please reach out directly:
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

export default ShippingPolicy;
