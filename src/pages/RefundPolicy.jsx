import React from "react";
import "../styles/AboutContact.css"; // Reuse styling for premium cards

const RefundPolicy = () => {
  return (
    <div className="contact-page-wrapper">
      <div className="about-hero">
        <h1>Cancellation & Refund Policy</h1>
        <p>Effective Date: August 2026</p>
      </div>

      <div className="about-content" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>1. Cancellations</h2>
          <p>
            You can cancel your order at any time before it has been shipped. To cancel your order, log into your account, navigate to "My Orders", and click on the "Cancel Order" button. 
            Once the order is cancelled, your payment will be refunded to your original payment method automatically.
          </p>
          <p>
            Please note that orders cannot be cancelled once they have been marked as <b>Shipped</b> or <b>Delivered</b>.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>2. Returns</h2>
          <p>
            We offer a <b>7-day return policy</b> for products that are received in a damaged, defective, or incorrect condition. 
            To initiate a return, please contact us via WhatsApp (98420 04217) or Email (loheshwaran311@gmail.com) within 7 days of receiving the package.
          </p>
          <p>
            Items must be unused, in their original packaging, and accompanied by the original purchase invoice to be eligible for return.
          </p>
        </div>

        <div className="about-card" style={{ marginBottom: "25px", padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>3. Refunds</h2>
          <p>
            Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. 
            If approved, your refund will be processed and automatically credited back to your original payment method (Credit/Debit Card, UPI, Net Banking) within <b>5 to 7 business days</b>.
          </p>
        </div>

        <div className="about-card" style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(94, 0, 153, 0.05)" }}>
          <h2 style={{ color: "#5e0099", borderBottom: "2px solid #D4AF37", paddingBottom: "10px" }}>4. Support</h2>
          <p>
            For any queries regarding cancellation, returns, or refunds, please reach out to us at:
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

export default RefundPolicy;
