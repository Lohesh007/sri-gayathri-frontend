import React from "react";
import "../styles/AboutContact.css";
console.log("ABOUT PAGE LOADED");

const About = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">About Sri Gayathri Fancy And Religious</h1>

      <section className="section">
        <h2>Our Mission</h2>
        <p>
          At Sri Gayathri Fancy And Religious, Velankanni, we aim to bring
          authentic, high-quality Christian religious items closer to everyone.
          We combine tradition with modern convenience through our online store.
        </p>
      </section>

      <section className="section">
        <h2>How to Purchase</h2>
        <p>You can order products through any of the following:</p>
        <ul>
          <li>🔸 <strong>WhatsApp</strong> – Quick ordering & inquiries</li>
          <li>🔸 <strong>Instagram</strong> – DM us anytime</li>
          <li>🔸 <strong>Phone Call</strong> – Direct customer support</li>
        </ul>
      </section>

      <section className="section">
        <h2>What We Sell</h2>
        <ul>
          <li>📿 Rosaries – Wood, Crystal & Plastic</li>
          <li>🕯️ Candle Stands – Brass, Metal & Ceramic</li>
          <li>🖼️ Framed Holy Pictures</li>
          <li>🗿 Statues – Ceramic, Fibre & PoP</li>
          <li>🔑 Holy Keychains</li>
        </ul>
      </section>

      <section className="section">
        <h2>Why Choose Us?</h2>
        <ul>
          <li>✅ Trusted business from Velankanni</li>
          <li>✅ Hand-picked religious items</li>
          <li>✅ Fast delivery & great customer support</li>
        </ul>
      </section>

      <section className="section">
        <h2>Contact & Support</h2>
        <p>
          You can reach us anytime through WhatsApp, Instagram, or phone—
          details available in the website footer.
        </p>
      </section>
    </div>
  );
};

export default About;
