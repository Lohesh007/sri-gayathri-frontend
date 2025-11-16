// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/ecommerce.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSub, setSelectedSub] = useState("");
  const navigate = useNavigate();

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
      const res = await API.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchSub = selectedSub === "" || p.subcategory === selectedSub;
    return matchName && matchCategory && matchSub;
  });

  return (
    <div className="products-page">

      {/* PAGE TITLE */}
      <h1 className="page-title gold-text">Our Products</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY FILTER */}
      <div className="filter-box">
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSub("");
          }}
        >
          <option value="All">All Categories</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {selectedCategory !== "All" && (
          <select
            className="filter-select"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {categories[selectedCategory].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* PRODUCTS GRID */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div
            className="product-card new-card"
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="img-box">
              <img src={product.image} alt={product.name} />
            </div>

            <h3 className="p-name">{product.name}</h3>

            <p className="price">
              ₹{product.price}
              <span className="mrp">₹{product.mrp}</span>
            </p>

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
    </div>
  );
};

export default Products;
