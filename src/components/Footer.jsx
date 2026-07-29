import React from "react";
import { Link } from "react-router-dom";
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
          <Link to="/products">Products</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/orders">My Orders</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Sri Gayathri Religious. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
