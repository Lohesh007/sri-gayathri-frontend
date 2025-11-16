// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/productdetails.css";   // ⭐ NEW SEPARATE CSS FILE FOR CLEAN DESIGN

const ProductDetails = () => {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get(`/products/${id}`);
      setP(res.data);
    };
    fetch();
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await API.post(
        "/cart/add",
        {
          productId: p._id,
          name: p.name,
          price: p.price,
          image: p.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item");
    }
  };

  if (!p) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="details-page">

      {/* LEFT: PRODUCT IMAGE */}
      <div className="details-left">
        <img src={p.image} alt={p.name} className="details-img" />
      </div>

      {/* RIGHT: CONTENT */}
      <div className="details-right">

        <h1 className="product-title">{p.name}</h1>

        <p className="product-category">
          {p.category} → <span>{p.subcategory}</span>
        </p>

        <h2 className="product-price">
          ₹{p.price}
          <span className="product-mrp">₹{p.mrp}</span>
        </h2>

        <p className="product-desc">{p.description}</p>

        <button className="btn-cart" onClick={addToCart}>
          🛒 Add to Cart
        </button>

        {/* CONTACT SECTION */}
        <div className="query-box">
          <p>For any queries or bulk orders, contact us:</p>

          <div className="contact-buttons">
            <button
              className="contact-btn"
              onClick={() =>
                window.open(
                  `https://wa.me/919842004217?text=Hi! I want to know more about ${p.name}.`
                )
              }
            >
              WhatsApp
            </button>

            <button
              className="contact-btn"
              onClick={() =>
                window.open("https://www.instagram.com/sri_gayathri_religious")
              }
            >
              Instagram
            </button>

            <button
              className="contact-btn"
              onClick={() => (window.location.href = "tel:+919597580853")}
            >
              Call
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
