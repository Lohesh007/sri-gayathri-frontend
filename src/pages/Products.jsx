// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import "../styles/ecommerce.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSub, setSelectedSub] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const navigate = useNavigate();
  const location = useLocation();

  const categories = {
    Rosaries: ["Chain Rosary", "Thread Rosary", "Wood Rosary", "10 Beads", "Baby Rosaries"],
    Statues: ["Ceramic Statues", "POP Statues", "Fibre Statues", "Radium Statues"],
    Photos: ["Wood Frame", "Golden Frame", "Unframed Photos"],
    Cross: ["Steel Cross", "Wooden Cross"],
    Lights: ["Rosary Lights", "Candle Lights", "Light Statues", "Night Lamps", "Christmas Star Lights"],
    Bangles: ["Covering Bangles", "Glass Bangles", "Metal Bangles"],
    Chains: ["Stainless Steel Chain", "Covering Chain", "German Chain"],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");
    const subcategoryParam = params.get("subcategory");

    if (categoryParam) setSelectedCategory(categoryParam);
    else setSelectedCategory("All");

    if (searchParam) setSearch(searchParam);
    else setSearch("");

    if (subcategoryParam) setSelectedSub(subcategoryParam);
    else setSelectedSub("");
  }, [location.search]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedSub("");
    setSortOrder("default");
    navigate("/products", { replace: true });
  };

  const getAvgRating = (p) => {
    if (!p.reviews || p.reviews.length === 0) return null;
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / p.reviews.length).toFixed(1);
  };

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchSub = selectedSub === "" || p.subcategory === selectedSub;
    return matchName && matchCategory && matchSub;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price;
    if (sortOrder === "price-high") return b.price - a.price;
    if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "rating") {
      const ratingA = parseFloat(getAvgRating(a)) || 0;
      const ratingB = parseFloat(getAvgRating(b)) || 0;
      return ratingB - ratingA;
    }
    return 0; // default
  });

  const categoryKeys = ["All", ...Object.keys(categories)];

  return (
    <div className="products-page">
      {/* PAGE TITLE */}
      <h1 className="page-title gold-text">Our Products</h1>

      {/* SEARCH AND SORT CONTAINER */}
      <div className="search-sort-bar">
        <input
          type="text"
          placeholder="Search products by name..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="sort-container">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default Sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>
      </div>

      {/* CATEGORIES PILLS (HORIZONTAL MOBILE TABS) */}
      <div className="categories-pills-wrapper">
        <div className="categories-pills-container">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSub("");
                // Update query string
                if (cat === "All") {
                  navigate("/products", { replace: true });
                } else {
                  navigate(`/products?category=${cat}`, { replace: true });
                }
              }}
            >
              {cat === "All" ? "🌍 All Items" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUBCATEGORY PILLS */}
      {selectedCategory !== "All" && (
        <div className="subcategory-pills-wrapper">
          <div className="subcategory-pills-container">
            <button
              className={`subcategory-pill ${selectedSub === "" ? "active" : ""}`}
              onClick={() => {
                setSelectedSub("");
                navigate(`/products?category=${selectedCategory}`, { replace: true });
              }}
            >
              All Subcategories
            </button>
            {categories[selectedCategory].map((sub) => (
              <button
                key={sub}
                className={`subcategory-pill ${selectedSub === sub ? "active" : ""}`}
                onClick={() => {
                  setSelectedSub(sub);
                  navigate(`/products?category=${selectedCategory}&subcategory=${sub}`, { replace: true });
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS DISPLAY LIST / EMPTY STATE */}
      {sortedProducts.length === 0 ? (
        <div className="empty-catalog-box animate-pop">
          <div className="empty-icon">🔍</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching your search or filters.</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <div
              className="product-card new-card"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="img-box">
                <img src={product.image} alt={product.name} />
              </div>

              <h3 className="p-name">{product.name}</h3>

              {/* RATING OVERLAY ON CARD */}
              {getAvgRating(product) && (
                <div className="card-rating">
                  <span className="star-icon">★</span>
                  <span className="rating-val">{getAvgRating(product)}</span>
                  <span className="rating-count">({product.reviews.length})</span>
                </div>
              )}

              <p className="price">
                ₹{product.price}
                <span className="mrp">₹{product.mrp}</span>
              </p>

              {product.stock <= 0 ? (
                <span className="out-of-stock-badge">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="low-stock-badge">Only {product.stock} left!</span>
              ) : null}

              <button
                className="view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product._id}`);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
