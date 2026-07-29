// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { ModalContext } from "../context/ModalContext";
import "../styles/Home.css";

import new1 from "../assets/images/new1.jpeg";
import new2 from "../assets/images/new2.jpeg";
import new3 from "../assets/images/new3.jpeg";
import popular1 from "../assets/images/popular1.jpeg";
import popular2 from "../assets/images/popular2.jpeg";
import popular3 from "../assets/images/popular3.jpeg";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const { showAlert } = useContext(ModalContext);

  const [newArrivals, setNewArrivals] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Fallbacks if backend contains no products
  const mockNewArrivals = [
    { img: new1, name: "Ceramic Jesus Statue", _id: null },
    { img: new2, name: "Wooden Bead Rosary", _id: null },
    { img: new3, name: "St. Mary Framed Photo", _id: null }
  ];

  const mockPopular = [
    { img: popular1, name: "Fibre Mother Mary", _id: null },
    { img: popular2, name: "Glow-in-Dark Rosary", _id: null },
    { img: popular3, name: "PoP Jesus Cross Stand", _id: null }
  ];

  const categoriesList = [
    { name: "Rosaries", icon: "📿", desc: "Premium thread, wood & chain rosaries" },
    { name: "Statues", icon: "⛪", desc: "Beautiful ceramic, fibre & POP statues" },
    { name: "Photos", icon: "🖼️", desc: "Framed wall photos & holy pictures" },
    { name: "Cross", icon: "✝", desc: "Altar standing and wall crucifixes" },
  ];

  const testimonials = [
    { name: "Maria D.", rating: 5, text: "The wooden rosaries are absolutely beautiful and high quality! Highly recommend Velankanni Sri Gayathri." },
    { name: "Joseph K.", rating: 5, text: "Excellent customer service and very fast shipping. The St. Mary statue is stunning." },
    { name: "Anish M.", rating: 4, text: "Bought a golden frame photo for my home chapel. Packaged very safely. Will buy again." }
  ];

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await API.get("/products");
        const list = res.data || [];

        if (list.length > 0) {
          // New arrivals: sort by creation date descending
          const sortedNew = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNewArrivals(sortedNew.slice(0, 3));

          // Popular: sort by average rating descending, fallback to creation
          const sortedPop = [...list].sort((a, b) => {
            const ratingA = a.rating || (a.reviews?.reduce((acc, r) => acc + r.rating, 0) / (a.reviews?.length || 1)) || 0;
            const ratingB = b.rating || (b.reviews?.reduce((acc, r) => acc + r.rating, 0) / (b.reviews?.length || 1)) || 0;
            return ratingB - ratingA;
          });
          setPopularProducts(sortedPop.slice(0, 3));
        }
      } catch (err) {
        console.error("Home page catalog load failure:", err);
      }
    };

    fetchCatalog();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      showAlert({
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        type: "error"
      });
      return;
    }
    showAlert({
      title: "Subscribed! 🎉",
      message: "Thank you for subscribing to our newsletter! Enjoy 10% off your next purchase.",
      type: "success"
    });
    setNewsletterEmail("");
  };

  const handleProductClick = (p) => {
    if (p._id) {
      navigate(`/product/${p._id}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-left-image">
          <img src={logo} alt="Logo" className="hero-logo glow" />
        </div>
        <div className="hero-right-text">
          <h1>
            Welcome to <span className="gold-text">Sri Gayathri Fancy & Religious</span>
          </h1>
          <p>
            Your trusted store in Velankanni for Religious Items, Rosaries, Holy Statues,
            Framed Photos, Candle Stands, Keychains, and more. Experience premium quality,
            divine collections, and fast delivery.
          </p>
          <Link to="/products" className="hero-shop-btn">
            Explore Products
          </Link>
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="section">
        <h2 className="section-title">🛍️ Shop By Category</h2>
        <div className="category-grid">
          {categoriesList.map((cat, i) => (
            <div
              className="category-card"
              key={i}
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section">
        <h2 className="section-title">🆕 New Arrivals</h2>
        <div className="product-grid">
          {(newArrivals.length > 0 ? newArrivals : mockNewArrivals).map((p, i) => (
            <div className="product-card" key={i} onClick={() => handleProductClick(p)}>
              <img src={p.image || p.img} alt={p.name} />
              <h3>{p.name}</h3>
              {p.price && <p className="home-product-price">₹{p.price}</p>}
              <button className="shop-btn">Shop Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAST SELLING PRODUCTS */}
      <section className="section">
        <h2 className="section-title">🔥 Fast Selling Products</h2>
        <div className="product-grid">
          {(popularProducts.length > 0 ? popularProducts : mockPopular).map((p, i) => (
            <div className="product-card" key={i} onClick={() => handleProductClick(p)}>
              <img src={p.image || p.img} alt={p.name} />
              <h3>{p.name}</h3>
              {p.price && <p className="home-product-price">₹{p.price}</p>}
              <button className="shop-btn">Shop Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOUNT PRODUCTS */}
      <section className="offer-section">
        <h2 className="section-title gold-text">🎁 Special Discounts</h2>
        <p className="offer-text">✨ 10% OFF on all Candle Stands this month</p>
        <p className="offer-text">📦 Free Delivery on orders above ₹499</p>
        <Link to="/products" className="discount-shop-btn">
          View Discount Items
        </Link>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="section testimonials-section">
        <h2 className="section-title text-center">⭐ Customer Testimonials</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <h4 className="testimonial-author">- {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SUBSCRIBE */}
      <section className="newsletter-section">
        <div className="newsletter-box">
          <h3>📩 Subscribe to our Newsletter</h3>
          <p>Get instant updates on new arrivals, local events, and exclusive discount codes!</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="subscribe-btn">Subscribe</button>
          </form>
        </div>
      </section>

      {/* BUSINESS DETAILS */}
      <section className="business-section">
        <h2 className="section-title">📍 About Our Store</h2>
        <p>
          Sri Gayathri Fancy & Religious is located in
          <span className="gold-text"> Velankanni, Nagapattinam, Tamil Nadu</span>. We specialize in
          premium religious items including:
        </p>

        <ul className="business-list">
          <li>✔ Ceramic, Fibre & PoP Statues</li>
          <li>✔ Rosaries & Holy Chains</li>
          <li>✔ Framed Photos & Wall Hangings</li>
          <li>✔ Candle Stands, Crosses & Lamps</li>
          <li>✔ Christian Religious Accessories</li>
        </ul>

        <p className="business-note">Bulk orders available for churches, shops & events.</p>

        <div className="contact-buttons">
          <a
            href="https://wa.me/919842004217?text=Hi!%20I%20want%20to%20know%20more%20about%20your%20products."
            className="contact-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a href="tel:+919597580853" className="contact-btn">
            Call Us
          </a>
          <a
            href="https://www.instagram.com/sri_gayathri_religious"
            className="contact-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
