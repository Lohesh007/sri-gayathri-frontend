// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { ModalContext } from "../context/ModalContext";
import "../styles/Home.css";

import holyFamilyWhite from "../assets/images/holy_family_white_gold.jpg";
import goldenCross from "../assets/images/golden_cross_emerald.jpg";
import goldenMonstrance from "../assets/images/golden_monstrance_jhs.jpg";
import sacredHeart from "../assets/images/sacred_heart_jesus.jpg";
import holyFamilyColor from "../assets/images/holy_family_color.jpg";
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const { showAlert } = useContext(ModalContext);

  const [newArrivals, setNewArrivals] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch swipe state for mobile cover carousel
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // 🌟 Featured Cover Carousel Products (Exact items requested from user catalog)
  const coverProducts = [
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1791439735/fu7etcqbwf0hjewkhowz.jpg",
      name: "Our lady of Velankanni Statue 30'' inches",
      price: "7,500",
      mrp: "8,500",
      badge: "30 Inch Fibre Statue",
      _id: "6ac73378d5e5999623b13798"
    },
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1791439845/fumps9plzpepjwh9vusk.jpg",
      name: "Our lady of Velankanni Statue 24'' inches",
      price: "5,500",
      mrp: "6,200",
      badge: "24 Inch Radium Statue",
      _id: "6ac733e6d5e5999623b1379d"
    },
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1790836812/oect0gsmzmlehgysknz1.png",
      name: "Holy Family 16'' inches",
      price: "2,400",
      mrp: "2,900",
      badge: "White Holy Family",
      _id: "6abe004d4fa9600f854e9153"
    },
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1790836774/vlokcmeyjj3au3sgucwl.png",
      name: "Sacred Heart of Jesus 12'' inches",
      price: "1,200",
      mrp: "1,500",
      badge: "12 Inch Statue",
      _id: "6abe00274fa9600f854e9145"
    },
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1790842066/qiuaepy4kg8cqympd7n7.jpg",
      name: "Navy blue glossy finish Chain Rosary",
      price: "250",
      mrp: "350",
      badge: "High Quality Rosary",
      _id: "6abe14d3d5e5999623b13532"
    },
    {
      img: "https://res.cloudinary.com/dontth6xt/image/upload/v1791272632/updljenhl9jtonnmel6x.jpg",
      name: "Double side car stand(umbrella type)",
      price: "300",
      mrp: "380",
      badge: "Umbrella Car Stand",
      _id: "6ac4a6bdd5e5999623b136ec"
    }
  ];

  // Fallbacks if backend contains no products
  const mockNewArrivals = [
    {
      img: holyFamilyWhite,
      name: "Vaticano Collezione Holy Family (White & Gold)",
      price: 2499,
      _id: null
    },
    {
      img: goldenCross,
      name: "Ornate Golden Altar Cross with Emerald Gem",
      price: 1850,
      _id: null
    },
    {
      img: goldenMonstrance,
      name: "Gold Plated Eucharistic Monstrance (JHS)",
      price: 3850,
      _id: null
    }
  ];

  const mockPopular = [
    {
      img: sacredHeart,
      name: "Vaticano Collezione Sacred Heart of Jesus",
      price: 2190,
      _id: null
    },
    {
      img: holyFamilyColor,
      name: "Vaticano Collezione Holy Family (Traditional)",
      price: 2690,
      _id: null
    },
    {
      img: goldenMonstrance,
      name: "Gold Plated Eucharistic Monstrance (JHS)",
      price: 3850,
      _id: null
    }
  ];

  const categoriesList = [
    { name: "Rosaries", icon: "📿", desc: "Premium thread, wood & chain rosaries" },
    { name: "Statues", icon: "⛪", desc: "Beautiful ceramic, fibre & POP statues" },
    { name: "Photos", icon: "🖼️", desc: "Framed wall photos & holy pictures" },
    { name: "Cross", icon: "✝", desc: "Altar standing and wall crucifixes" },
  ];

  const testimonials = [
    { name: "Maria D.", rating: 5, text: "The Vaticano Collezione Holy Family statue is breathtaking! The gold trim detail is immaculate." },
    { name: "Joseph K.", rating: 5, text: "Purchased the golden monstrance for our chapel. High quality, safe packaging and fast delivery to Velankanni." },
    { name: "Anish M.", rating: 5, text: "The emerald crystal altar cross is stunning under prayer lights. Highly recommend Sri Gayathri." }
  ];

  // Auto-advance cover slide every 4 seconds
  useEffect(() => {
    if (coverProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % coverProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [coverProducts.length]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await API.get("/products");
        const list = res.data || [];

        if (list.length > 0) {
          // Separate Statues vs Non-Statues
          const statues = list.filter((p) => p.category === "Statues");
          const nonStatues = list.filter((p) => p.category !== "Statues");

          // Helper to select 6 statues + 2 others = 8 total items
          const createSet = (statueList, otherList, isReverse = false) => {
            const sList = isReverse ? [...statueList].reverse() : [...statueList];
            const oList = isReverse ? [...otherList].reverse() : [...otherList];

            const pickedStatues = sList.slice(0, 6);
            const pickedOthers = oList.slice(0, 8 - pickedStatues.length);
            return [...pickedStatues, ...pickedOthers];
          };

          // New Arrivals: 8 items (6 Statues + 2 Rosary/Others)
          const newSet = createSet(statues, nonStatues, false);
          setNewArrivals(newSet);

          // Fast Selling Products: 8 items (6 Statues + 2 Rosary/Others)
          const fastSet = createSet(statues, nonStatues, true);
          setPopularProducts(fastSet);
        }
      } catch (err) {
        console.error("Home page catalog load failure:", err);
      }
    };

    fetchCatalog();
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % coverProducts.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? coverProducts.length - 1 : prev - 1));
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

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

  const activeCover = coverProducts[currentSlide];

  return (
    <div className="home-container">
      {/* FEATURED COVER SLIDER HERO SECTION WITH TOUCH SWIPE (NAME & PRICE ONLY) */}
      <div className="cover-carousel-wrapper">
        <div 
          className="hero-section cover-carousel-slide"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleProductClick(activeCover)}
          style={{ cursor: "pointer" }}
        >
          <div className="hero-left-image cover-img-box">
            <img
              src={activeCover.img}
              alt={activeCover.name}
              className="cover-product-img glow"
            />
            <span className="cover-badge">{activeCover.badge}</span>
          </div>

          <div className="hero-right-text">
            <div className="hero-brand-tagline">
              <img src={logo} alt="Logo" className="hero-mini-logo" />
              <span>Sri Gayathri Religious</span>
            </div>

            <h1 className="cover-title">{activeCover.name}</h1>

            <div className="cover-price-row">
              <span className="cover-price">₹{activeCover.price}</span>
              {activeCover.mrp && <span className="cover-mrp">MRP ₹{activeCover.mrp}</span>}
            </div>

            <div className="cover-action-group">
              <button 
                className="hero-shop-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(activeCover);
                }}
              >
                View Product ➔
              </button>
            </div>
          </div>
        </div>

        {/* CAROUSEL INDICATOR DOTS */}
        <div className="carousel-dots-container">
          {coverProducts.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${currentSlide === idx ? "active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY (2 COLUMNS ON MOBILE) */}
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

      {/* NEW ARRIVALS (2 COLUMNS ON MOBILE) */}
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

      {/* FAST SELLING PRODUCTS (2 COLUMNS ON MOBILE) */}
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
            className="contact-btn wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            📱 WhatsApp
          </a>
          <a href="tel:+919597580853" className="contact-btn call">
            📞 Call Us
          </a>
          <a
            href="https://www.instagram.com/sri_gayathri_religious"
            className="contact-btn insta"
            target="_blank"
            rel="noopener noreferrer"
          >
            📸 Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
