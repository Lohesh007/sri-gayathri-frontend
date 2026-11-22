// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import "../styles/ecommerce.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSub, setSelectedSub] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  const navigate = useNavigate();
  const location = useLocation();

  const categories = {
    Rosaries: ["chain rosary", "thread rosary", "10 beat rosaries", "wood rosary", "baby rosaries"],
    Statues: ["ceramic statues", "pop statues", "fibre statues", "radium statues"],
    Photos: ["wood framed photos", "unframed photos", "golden framed photos"],
    Cross: ["steel cross", "wooden cross"],
    Keychain: ["metal keychain", "wooden keychain", "crystal keychain", "photo keychain", "general keychain"],
    Others: ["car stands", "candle stands", "stickers & badges", "prayer books", "general items"],
    Lights: ["rosary lights", "candle lights", "light statues", "night lamps", "christmas star lights"],
    Bangles: ["covering bangles", "glass bangles", "metal bangles"],
    Chains: ["stainless steel chain", "covering chain", "german chain"],
  };

  const formatLabel = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products");
        const shuffled = shuffleArray(res.data || []);
        setProducts(shuffled);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
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
    setCurrentPage(1);
    navigate("/products", { replace: true });
  };

  const getAvgRating = (p) => {
    if (!p.reviews || p.reviews.length === 0) return null;
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / p.reviews.length).toFixed(1);
  };

  const filteredProducts = products
    .filter((p) => {
      const matchName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "All" ||
        (p.category && (
          p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase() ||
          (selectedCategory.toLowerCase() === "keychain" && p.category.toLowerCase().includes("keychain")) ||
          (selectedCategory.toLowerCase() === "others" && (p.category.toLowerCase() === "other" || p.category.toLowerCase() === "others"))
        ));

      const matchSub =
        selectedSub === "" ||
        (p.subcategory && (
          p.subcategory.trim().toLowerCase() === selectedSub.trim().toLowerCase() ||
          p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, "").includes(selectedSub.toLowerCase().replace(/[^a-z0-9]/g, "")) ||
          selectedSub.toLowerCase().replace(/[^a-z0-9]/g, "").includes(p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, ""))
        ));

      return matchName && matchCategory && matchSub;
    })
    .sort((a, b) => {
      // When user is searching, sort: starts-with first, then alphabetical
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name);
      }
      return 0;
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
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                setCurrentPage(1);
                if (cat === "All") {
                  navigate("/products", { replace: true });
                } else {
                  navigate(`/products?category=${cat}`, { replace: true });
                }
              }}
            >
              {cat === "All" ? "All Items" : cat}
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
                setCurrentPage(1);
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
                  setCurrentPage(1);
                  navigate(`/products?category=${selectedCategory}&subcategory=${sub}`, { replace: true });
                }}
              >
                {formatLabel(sub)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS DISPLAY LIST / LOADING / EMPTY STATE */}
      {loading ? (
        <div className="empty-catalog-box">
          <div className="auth-loader" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "15px", color: "#5e0099", fontWeight: "bold" }}>Loading products catalog...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-catalog-box animate-pop">
          <div className="empty-icon">&#128269;</div>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching your search or filters.</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* PRODUCT COUNT */}
          <p style={{ color: "#777", fontSize: "14px", marginBottom: "10px", paddingLeft: "4px" }}>
            Showing {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
          </p>

          <div className="product-grid">
            {paginatedProducts.map((product) => (
              <div
                className="product-card new-card"
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="img-box">
                  <img src={product.image} alt={product.name} />
                </div>

                <h3 className="p-name">{product.name}</h3>

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

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-num-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
