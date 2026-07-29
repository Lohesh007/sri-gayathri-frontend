// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import "../styles/productdetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const navigate = useNavigate();
  const { user, token, setCartCount } = useContext(AuthContext);
  const { showAlert, showConfirm } = useContext(ModalContext);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setP(res.data);
      } catch (err) {
        console.error("Failed to load product details:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    showConfirm({
      title: "Add to Cart",
      message: `Do you want to add ${qty} x "${p.name}" to your cart?`,
      type: "info",
      confirmText: "Yes, Add",
      onConfirm: async () => {
        try {
          await API.post(
            "/cart/add",
            {
              productId: p._id,
              name: p.name,
              image: p.image,
              quantity: qty,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setCartCount((prev) => prev + qty);
          showAlert({
            title: "Success",
            message: `${qty} item(s) added to cart!`,
            type: "success",
            onConfirm: () => navigate("/cart")
          });
        } catch (err) {
          console.error("Add to cart error:", err);
          showAlert({
            title: "Error",
            message: err.response?.data?.message || "Failed to add item",
            type: "error"
          });
        }
      }
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        `/products/${id}/reviews`,
        { rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setP(res.data.product);
      setNewComment("");
      setNewRating(5);
      showAlert({
        title: "Success",
        message: "Review submitted successfully!",
        type: "success"
      });
    } catch (err) {
      console.error("Submit review error:", err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to submit review",
        type: "error"
      });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-gold">★</span>);
      } else {
        stars.push(<span key={i} className="star-gray">☆</span>);
      }
    }
    return stars;
  };

  if (!p) return <h2 className="loading">Loading...</h2>;

  const allImages = p.images && p.images.length > 0 ? [p.image, ...p.images] : [p.image];

  return (
    <div className="details-page-wrapper">
      <div className="details-page">

        {/* LEFT: PRODUCT IMAGE CAROUSEL */}
        <div className="details-left">
          <div className="carousel-container">
            <img src={allImages[activeImgIndex]} alt={p.name} className="details-img" />
            
            {allImages.length > 1 && (
              <div className="carousel-controls">
                <button 
                  className="carousel-btn prev"
                  onClick={() => setActiveImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                >
                  ◀
                </button>
                <button 
                  className="carousel-btn next"
                  onClick={() => setActiveImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="thumbnail-strip">
              {allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail-${idx}`}
                  className={`thumbnail ${idx === activeImgIndex ? "active" : ""}`}
                  onClick={() => setActiveImgIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: CONTENT */}
        <div className="details-right">

          <h1 className="product-title">{p.name}</h1>

          {/* Average Rating stars */}
          <div className="product-rating-summary">
            {renderStars(p.rating || 0)}
            <span className="reviews-count">({p.numReviews || 0} customer reviews)</span>
          </div>

          <p className="product-category">
            {p.category} → <span>{p.subcategory}</span>
          </p>

          <h2 className="product-price">
            ₹{p.price}
            <span className="product-mrp">₹{p.mrp}</span>
          </h2>

          {p.stock <= 0 ? (
            <p className="stock-status out-of-stock">Status: <span className="red-badge">Out of Stock</span></p>
          ) : (
            <p className="stock-status in-stock">
              Status: <span className="green-badge">In Stock ({p.stock} available)</span>
            </p>
          )}

          <p className="product-desc">{p.description}</p>

          {/* ADD TO CART ACTION BLOCK */}
          {user?.isAdmin ? (
            <div className="admin-order-notice">
              🛡 Ordering is disabled for administrative accounts.
            </div>
          ) : (
            <div className="cart-action-block">
              {p.stock > 0 && (
                <div className="qty-selector-container">
                  <button 
                    type="button" 
                    className="qty-btn minus" 
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button 
                    type="button" 
                    className="qty-btn plus" 
                    onClick={() => setQty((prev) => Math.min(p.stock, prev + 1))}
                    disabled={qty >= p.stock}
                  >
                    +
                  </button>
                </div>
              )}

              <button className="btn-cart" onClick={addToCart} disabled={p.stock <= 0}>
                {p.stock <= 0 ? "❌ Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>
          )}

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

      {/* REVIEWS & RATINGS SECTION */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {p.reviews && p.reviews.length > 0 ? (
          <div className="reviews-list">
            {p.reviews.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <div className="review-stars-date">
                    <span className="review-stars">{renderStars(r.rating)}</span>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        )}

        {/* SUBMIT REVIEW FORM */}
        {user && !user.isAdmin ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write a Customer Review</h3>
            
            {/* INTERACTIVE GOLD STARS RATINGS INPUT */}
            <div className="form-group">
              <label className="rating-label">Rating</label>
              <div className="interactive-stars-group">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`interactive-star ${star <= newRating ? "gold" : "gray"}`}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-desc-label">
                  {newRating === 5 && "Excellent (5/5)"}
                  {newRating === 4 && "Very Good (4/5)"}
                  {newRating === 3 && "Good (3/5)"}
                  {newRating === 2 && "Fair (2/5)"}
                  {newRating === 1 && "Poor (1/5)"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Your Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this item..."
                required
              />
            </div>
            <button type="submit" className="submit-review-btn">Submit Review</button>
          </form>
        ) : user?.isAdmin ? (
          <p className="admin-review-block">🛡 Administrative accounts cannot write reviews.</p>
        ) : (
          <p className="login-review-prompt">
            Please <Link to="/login">login</Link> to write a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
