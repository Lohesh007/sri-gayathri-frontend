// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import API from "../api";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout, cartCount } = useContext(AuthContext);
  const { showConfirm } = useContext(ModalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Check if current path belongs to auth routines
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset", "/verify-email"].some(
    (path) => location.pathname.startsWith(path)
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await API.get("/products");
        setAllProducts(res.data || []);
      } catch (err) {
        console.error("Load navbar search products failed:", err);
      }
    };
    loadProducts();
  }, []);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);
    setSuggestions(filtered);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    showConfirm({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      type: "warning",
      confirmText: "Yes, Logout",
      onConfirm: () => {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <nav className="navbar">

      {/* LOGO + TITLE */}
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <h2 className="nav-title">Sri Gayathri Fancy & Religious</h2>
      </div>

      {/* SEARCH BAR WITH AUTO-COMPLETE */}
      {!isAuthPage && (
        <div className="nav-search-container">
          <form onSubmit={handleSearchSubmit} className="nav-search-form" style={{ width: "100%", display: "flex" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
            />
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  className="suggestion-item"
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                    setSearchQuery("");
                  }}
                >
                  <img src={p.image} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HAMBURGER ICON - mobile */}
      <div 
        className="hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>

        {user ? (
          <>
            {!user.isAdmin && (
              <>
                <li>
                  <Link to="/cart" onClick={() => setMenuOpen(false)}>
                    Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </Link>
                </li>
                <li><Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link></li>
              </>
            )}

            {user.isAdmin && (
              <>
                <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Products</Link></li>
                <li><Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Admin Orders</Link></li>
              </>
            )}

            <li>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile ({user?.username})
              </Link>
            </li>

            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
