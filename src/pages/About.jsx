// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/AboutContact.css";

const About = () => {
  const brandPillars = [
    {
      icon: "📍",
      title: "Roots in Velankanni",
      desc: "Proudly operating from the holy town of Velankanni, Tamil Nadu, supplying blessed religious items."
    },
    {
      icon: "✨",
      title: "Handpicked Quality",
      desc: "Every statue, rosary, and crucifix is hand-inspected to guarantee top-tier materials and premium finish."
    },
    {
      icon: "📦",
      title: "Reliable Shipping",
      desc: "We package all items with high-security protective layers so they arrive safely at your doorstep."
    }
  ];

  const purchaseChannels = [
    {
      icon: "💬",
      title: "WhatsApp Direct",
      desc: "Instantly chat with us to check live stock, inquire about bulk orders, or place a quick order.",
      actionText: "Chat on WhatsApp",
      link: "https://wa.me/919842004217?text=Hi!%20I%20want%20to%20know%20more%20about%20your%20religious%20items."
    },
    {
      icon: "📞",
      title: "Direct Phone Call",
      desc: "Call our customer service line directly for immediate assistance, payment support, or store location queries.",
      actionText: "Call Us Now",
      link: "tel:+919597580853"
    },
    {
      icon: "📸",
      title: "Instagram Page",
      desc: "Follow us to browse new arrivals, view customer reviews, and check product demos via DMs.",
      actionText: "Follow on Instagram",
      link: "https://www.instagram.com/sri_gayathri_religious"
    }
  ];

  return (
    <div className="about-page-wrapper">
      
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">Sri Gayathri Fancy & Religious</h1>
          <p className="about-hero-subtitle">
            Connecting Devotion with Quality — Handpicked religious items from the heart of Velankanni.
          </p>
        </div>
      </section>

      <div className="about-content-container">
        
        {/* MISSION STATEMENT */}
        <section className="about-card mission-section">
          <h2 className="about-section-title">✨ Our Mission & Story</h2>
          <p>
            For years, <strong>Sri Gayathri Fancy & Religious</strong> has been a trusted supplier of religious articles 
            in Velankanni, Tamil Nadu. Our mission is to bridge the gap between devotion and quality. By combining our 
            physical store heritage with this online storefront, we make authentic statues, rosaries, and church accessories 
            accessible to believers across the country.
          </p>
          <p>
            Whether you are looking for a ceramic statue for your family altar, a wood-beaded rosary for daily prayer, 
            or bulk items for church festivals and sacraments, we are dedicated to serving you with the highest integrity.
          </p>
        </section>

        {/* CORE VALUES / BRAND PILLARS */}
        <section className="about-pillars-section">
          <h2 className="about-section-title text-center">🛡️ Why Choose Sri Gayathri?</h2>
          <div className="about-pillars-grid">
            {brandPillars.map((pillar, i) => (
              <div className="about-pillar-card" key={i}>
                <div className="pillar-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT WE OFFER (PRODUCT CATEGORIES HIGHLIGHT) */}
        <section className="about-card offer-details-section">
          <h2 className="about-section-title">⛪ Blessed Devotional Collections</h2>
          <p>We take pride in hosting a diverse collection of premium Catholic devotional items, including:</p>
          <div className="collections-bullet-grid">
            <div className="bullet-col">
              <p>📿 <strong>Rosaries:</strong> Wooden, glass, glowing, and steel chain rosaries.</p>
              <p>🕯️ <strong>Candle Stands:</strong> Brass, metal, ceramic stands, and altar crosses.</p>
            </div>
            <div className="bullet-col">
              <p>🗿 <strong>Statues:</strong> Fiber, ceramic, radium, and Plaster of Paris holy figures.</p>
              <p>🖼️ <strong>Framed Photos:</strong> Golden border and wooden frames of saints and holy scenes.</p>
            </div>
          </div>
          <div className="about-explore-row">
            <Link to="/products" className="about-explore-btn">
              🛍️ Explore Our Full Catalog
            </Link>
          </div>
        </section>

        {/* PURCHASE & CONTACT CHANNELS */}
        <section className="about-purchase-section">
          <h2 className="about-section-title text-center">📞 Quick Support & Ordering</h2>
          <p className="purchase-subtitle text-center">
            Prefer not to order through the website? You can place direct orders or request bulk discounts via any of these channels:
          </p>
          
          <div className="purchase-channels-grid">
            {purchaseChannels.map((chan, i) => (
              <div className="purchase-channel-card" key={i}>
                <div className="channel-icon">{chan.icon}</div>
                <h3>{chan.title}</h3>
                <p>{chan.desc}</p>
                <a href={chan.link} className="channel-action-btn" target="_blank" rel="noopener noreferrer">
                  {chan.actionText}
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
