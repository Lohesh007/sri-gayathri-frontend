// src/pages/Home.jsx
import React from "react";
import "../styles/Home.css";
import new1 from "../assets/images/new1.jpeg";
import new2 from "../assets/images/new2.jpeg";
import new3 from "../assets/images/new3.jpeg";
import popular1 from "../assets/images/popular1.jpeg";
import popular2 from "../assets/images/popular2.jpeg";
import popular3 from "../assets/images/popular3.jpeg";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">

     {/* HERO SECTION */}
<div className="hero-section">

  {/* LEFT — LOGO */}
  <div className="hero-left-image">
    <img src={logo} alt="Logo" className="hero-logo glow" />
  </div>

  {/* RIGHT — TEXT + BUTTON */}
  <div className="hero-right-text">
    <h1>
      Welcome to <span className="gold-text">Sri Gayathri Fancy & Religious</span>
    </h1>

    <p>
      Your trusted store for Religious Items, Rosaries, Holy Statues,
      Framed Photos, Candle Stands, Keychains, and more.  
      Experience premium quality, divine collections, and fast delivery.
    </p>

    <Link to="/products" className="hero-shop-btn">
      Explore Products
    </Link>
  </div>

</div>

      {/* NEW ARRIVALS */}
      <section className="section">
        <h2 className="section-title">🆕 New Arrivals</h2>
        <div className="product-grid">
          {[{img:new1, name:"Ceramic Jesus Statue"},
            {img:new2, name:"Wooden Bead Rosary"},
            {img:new3, name:"St. Mary Framed Photo"}].map((p, i) => (
            <div className="product-card" key={i}>
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <Link to="/products" className="shop-btn">Shop Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAST SELLING PRODUCTS */}
      <section className="section">
        <h2 className="section-title">🔥 Fast Selling Products</h2>
        <div className="product-grid">
          {[{img:popular1, name:"Fibre Mother Mary"},
            {img:popular2, name:"Glow-in-Dark Rosary"},
            {img:popular3, name:"PoP Jesus Cross Stand"}].map((p, i) => (
            <div className="product-card" key={i}>
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <Link to="/products" className="shop-btn">Shop Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOUNT PRODUCTS */}
      <section className="offer-section">
        <h2 className="section-title gold-text">🎁 Special Discounts</h2>
        <p className="offer-text">✨ 10% OFF on all Candle Stands this month</p>
        <p className="offer-text">📦 Free Delivery on orders above ₹499</p>
        <Link to="/products" className="discount-shop-btn">View Discount Items</Link>
      </section>

      {/* BUSINESS DETAILS */}
      <section className="business-section">
        <h2 className="section-title">📍 About Our Store</h2>
        <p>
          Sri Gayathri Fancy & Religious is located in  
          <span className="gold-text"> Velankanni, Nagapattinam, Tamil Nadu</span>.  
          We specialize in premium religious items including:
        </p>

        <ul className="business-list">
          <li>✔ Ceramic, Fibre & PoP Statues</li>
          <li>✔ Rosaries & Holy Chains</li>
          <li>✔ Framed Photos & Wall Hangings</li>
          <li>✔ Candle Stands, Crosses & Lamps</li>
          <li>✔ Christian Religious Accessories</li>
        </ul>

        <p className="business-note">
          Bulk orders available for churches, shops & events.
        </p>

        <div className="contact-buttons">
          <a href="https://wa.me/yourNumber" className="contact-btn">WhatsApp</a>
          <a href="tel:yourNumber" className="contact-btn">Call Us</a>
          <a href="https://instagram.com" className="contact-btn">Instagram</a>
        </div>
      </section>

    </div>
  );
};

export default Home;
