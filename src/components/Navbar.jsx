// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO + TITLE */}
      <div className="nav-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <h2 className="nav-title">Sri Gayathri Fancy & Religious</h2>
      </div>

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
                <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>
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
