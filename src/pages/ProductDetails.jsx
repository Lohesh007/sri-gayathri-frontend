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
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate();
  const { user, token, setCartCount } = useContext(AuthContext);
  const { showAlert, showConfirm } = useContext(ModalContext);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [qty, setQty] = useState(1);

  // Touch swipe state for mobile slideshow
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImgIndex(0);
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setP(res.data);

        // Fetch catalog to find similar products
        const catalogRes = await API.get("/products");
        const list = catalogRes.data || [];

        // Shuffle helper
        const shuffle = (arr) => {
          const a = [...arr];
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };

        // 1. Same category items (excluding current product)
        let categoryMatches = list.filter(
          (item) => item.category === res.data.category && item._id !== res.data._id
        );
        categoryMatches = shuffle(categoryMatches);

        const TARGET_COUNT = 6;
        let finalSimilar = [...categoryMatches];

        // 2. If same category has fewer items, fill up from DIFFERENT categories!
        if (finalSimilar.length < TARGET_COUNT) {
          const usedIds = new Set([res.data._id, ...finalSimilar.map((item) => item._id)]);
          const otherCategoryItems = list.filter((item) => !usedIds.has(item._id));
          const shuffledOthers = shuffle(otherCategoryItems);

          const needed = TARGET_COUNT - finalSimilar.length;
          finalSimilar = [...finalSimilar, ...shuffledOthers.slice(0, needed)];
        }

        setSimilarProducts(finalSimilar.slice(0, TARGET_COUNT));
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

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (allImagesCount) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      setActiveImgIndex((prev) => (prev === allImagesCount - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setActiveImgIndex((prev) => (prev === 0 ? allImagesCount - 1 : prev - 1));
    }
    setTouchStart(0);
    setTouchEnd(0);
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

  if (!p) return <div className="details-loading-spinner">Loading Product Details...</div>;

  const allImages = p.images && p.images.length > 0 
    ? Array.from(new Set([p.image, ...p.images])).filter(Boolean)
    : [p.image];

  const discountPercent = p.mrp && p.mrp > p.price
    ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
    : 0;

  return (
    <div className="details-page-wrapper">
      <div className="details-page">

        {/* LEFT: SLIDESHOW GALLERY (MOBILE TOUCH SWIPE & THUMBNAILS) */}
        <div className="details-left">
          <div 
            className="carousel-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(allImages.length)}
          >
            {discountPercent > 0 && (
              <span className="discount-badge-overlay">
                {discountPercent}% OFF
              </span>
            )}

            {allImages.length > 1 && (
              <span className="image-counter-badge">
                📷 {activeImgIndex + 1} / {allImages.length}
              </span>
            )}

            <img 
              src={allImages[activeImgIndex]} 
              alt={p.name} 
              className="details-img" 
            />
            
            {allImages.length > 1 && (
              <div className="carousel-controls">
                <button 
                  className="carousel-btn prev"
                  onClick={() => setActiveImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  aria-label="Previous Image"
                >
                  ‹
                </button>
                <button 
                  className="carousel-btn next"
                  onClick={() => setActiveImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  aria-label="Next Image"
                >
                  ›
                </button>
              </div>
            )}

            {/* Dots indicator for mobile */}
            {allImages.length > 1 && (
              <div className="carousel-dots">
                {allImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === activeImgIndex ? "active" : ""}`}
                    onClick={() => setActiveImgIndex(idx)}
                  />
                ))}
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

        {/* RIGHT: PRODUCT DETAILS & PRICING */}
        <div className="details-right">

          <div className="category-breadcrumb">
            <span className="cat-chip">{p.category}</span>
            {p.subcategory && <span className="sub-chip">› {p.subcategory}</span>}
          </div>

          <h1 className="product-title">{p.name}</h1>

          {/* Rating Summary (Amazon Style) */}
          <div className="product-rating-summary">
            <div className="rating-pill">
              <span>{p.rating ? p.rating.toFixed(1) : "5.0"}</span> ★
            </div>
            <span className="reviews-count">({p.numReviews || 0} reviews)</span>
          </div>

          {/* Flipkart / Amazon style price display */}
          <div className="price-container">
            <span className="selling-price">₹{p.price}</span>
            {p.mrp && p.mrp > p.price && (
              <>
                <span className="mrp-price">₹{p.mrp}</span>
                <span className="discount-tag">{discountPercent}% OFF</span>
              </>
            )}
          </div>
          <span className="tax-inclusive-text">Inclusive of all taxes</span>

          {/* Stock Status Badge */}
          {p.stock <= 0 ? (
            <div className="stock-status out-of-stock">
              <span className="red-badge">❌ Out of Stock</span>
            </div>
          ) : (
            <div className="stock-status in-stock">
              <span className="green-badge">✓ In Stock ({p.stock} available)</span>
            </div>
          )}

          {/* Amazon/Flipkart Trust Features */}
          <div className="trust-features-bar">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <span className="trust-label">Fast Shipping</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-label">100% Genuine</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💳</span>
              <span className="trust-label">Secure Payment</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💬</span>
              <span className="trust-label">WhatsApp Help</span>
            </div>
          </div>

          {/* Description Box */}
          <div className="description-card">
            <h3>Product Overview & Specifications</h3>
            <p className="product-desc">{p.description || "High quality authentic devotional item carefully handcrafted for divine worship and prayer."}</p>
          </div>

          {/* ADD TO CART ACTION BLOCK (Desktop / Main view) */}
          {user?.isAdmin ? (
            <div className="admin-order-notice">
              🛡 Ordering is disabled for administrative accounts.
            </div>
          ) : (
            <div className="cart-action-block">
              {p.stock > 0 && (
                <div className="qty-selector-container">
                  <span className="qty-label">Qty:</span>
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
                {p.stock <= 0 ? "Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>
          )}

          {/* CONTACT & QUERY SECTION */}
          <div className="query-box">
            <p className="query-title">Have questions or want custom bulk orders?</p>
            <div className="contact-buttons">
              <button
                className="contact-btn wa"
                onClick={() =>
                  window.open(
                    `https://wa.me/919842004217?text=Hi! I want to inquire about ${p.name}.`
                  )
                }
              >
                📱 WhatsApp
              </button>

              <button
                className="contact-btn insta"
                onClick={() =>
                  window.open("https://www.instagram.com/sri_gayathri_religious")
                }
              >
                📸 Instagram
              </button>

              <button
                className="contact-btn call"
                onClick={() => (window.location.href = "tel:+919597580853")}
              >
                📞 Call Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div className="reviews-section">
        <h2>Customer Reviews & Ratings</h2>
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
          <p className="no-reviews">No customer reviews yet. Be the first to share feedback!</p>
        )}

        {/* SUBMIT REVIEW FORM */}
        {user && !user.isAdmin ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Write a Review</h3>
            
            <div className="form-group">
              <label className="rating-label">Your Rating</label>
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
                  {newRating === 5 && "5/5 (Excellent)"}
                  {newRating === 4 && "4/5 (Very Good)"}
                  {newRating === 3 && "3/5 (Good)"}
                  {newRating === 2 && "2/5 (Fair)"}
                  {newRating === 1 && "1/5 (Poor)"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Your Feedback</label>
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

      {/* SIMILAR PRODUCTS SECTION (2 COLUMNS ON MOBILE LIKE AMAZON / FLIPKART) */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <div className="similar-header">
            <h2 className="similar-title">✨ Similar Products You May Like</h2>
            <span className="similar-subtitle">Based on {p.category}</span>
          </div>

          <div className="similar-products-grid">
            {similarProducts.map((sim) => {
              const simDiscount = sim.mrp && sim.mrp > sim.price
                ? Math.round(((sim.mrp - sim.price) / sim.mrp) * 100)
                : 0;

              return (
                <div
                  className="similar-card"
                  key={sim._id}
                  onClick={() => navigate(`/product/${sim._id}`)}
                >
                  <div className="similar-img-wrapper">
                    {simDiscount > 0 && (
                      <span className="similar-discount-badge">{simDiscount}% OFF</span>
                    )}
                    <img src={sim.image} alt={sim.name} className="similar-img" />
                  </div>

                  <div className="similar-card-info">
                    <h3 className="similar-card-name">{sim.name}</h3>
                    
                    <div className="similar-card-rating">
                      <span className="similar-star-badge">
                        {sim.rating ? sim.rating.toFixed(1) : "5.0"} ★
                      </span>
                    </div>

                    <div className="similar-card-price-row">
                      <span className="similar-price">₹{sim.price}</span>
                      {sim.mrp && sim.mrp > sim.price && (
                        <span className="similar-mrp">₹{sim.mrp}</span>
                      )}
                    </div>

                    <button
                      className="similar-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${sim._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BAR (AMAZON / FLIPKART STYLE) */}
      {!user?.isAdmin && p.stock > 0 && (
        <div className="mobile-sticky-cta">
          <div className="sticky-price-info">
            <span className="sticky-price">₹{p.price * qty}</span>
            <span className="sticky-qty-text">({qty} item{qty > 1 ? "s" : ""})</span>
          </div>
          <button className="sticky-cart-btn" onClick={addToCart}>
            🛒 Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
