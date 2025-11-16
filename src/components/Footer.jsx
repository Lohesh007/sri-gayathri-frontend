import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-main">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Sri Gayathri Religious</h2>
          <p>Velankanni · Nagapattinam · Tamil Nadu</p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📞 95975 80853</p>
          <p>📱 WhatsApp: 98420 04217</p>
          <p>📸 Instagram: @sri_gayathri_religious</p>
        </div>

        {/* Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="/products">Products</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/orders">My Orders</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Sri Gayathri Religious. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
