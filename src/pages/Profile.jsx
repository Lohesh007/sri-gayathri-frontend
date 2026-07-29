// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/ProfilePage.css";

const Profile = () => {
  const { token, updateUser } = useContext(AuthContext);
  const { showAlert } = useContext(ModalContext);

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  // Dashboard Stats States
  const [stats, setStats] = useState({
    ordersCount: 0,
    cartItemsCount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) return navigate("/login");

      try {
        // Fetch profile
        const profileRes = await API.get("/users/profile");
        setProfile(profileRes.data);
        setForm(profileRes.data);

        // Fetch orders count
        const ordersRes = await API.get("/orders");
        const ordersCount = ordersRes.data?.length || 0;

        // Fetch cart count
        const cartRes = await API.get("/cart");
        const cartItemsCount = cartRes.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

        setStats({ ordersCount, cartItemsCount });
      } catch (err) {
        console.error("Profile/stats loading error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, navigate]);

  const handleSave = async () => {
    if (!form.username || !form.username.trim()) {
      showAlert({ title: "Validation Error", message: "Name cannot be empty", type: "error" });
      return;
    }
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      showAlert({ title: "Validation Error", message: "Please enter a valid 10-digit mobile number", type: "error" });
      return;
    }
    if (!form.address || !form.address.trim()) {
      showAlert({ title: "Validation Error", message: "Address cannot be empty", type: "error" });
      return;
    }

    try {
      const res = await API.put("/users/update-profile", {
        username: form.username,
        mobile: form.mobile,
        address: form.address,
      });

      updateUser(res.data.user);
      setProfile(res.data.user);
      setEditMode(false);

      showAlert({
        title: "Success",
        message: "Profile updated successfully!",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Update failed",
        type: "error"
      });
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile) return <div className="profile-loading">Unable to load profile.</div>;

  return (
    <div className="profile-dashboard-wrapper">
      <div className="dashboard-container">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-avatar">
              {profile.username[0].toUpperCase()}
            </div>
            <h3>{profile.username}</h3>
            <span className="user-role-badge">
              {profile.isAdmin ? "🛡️ Administrator" : "🛒 Verified Customer"}
            </span>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item active">👤 Account Overview</button>
            <Link to="/orders" className="nav-item-link">📦 My Orders ({stats.ordersCount})</Link>
            <Link to="/cart" className="nav-item-link">🛒 My Shopping Cart ({stats.cartItemsCount})</Link>
            <Link to="/products" className="nav-item-link">🛍️ Browse Shop</Link>
          </nav>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="dashboard-main">
          
          {/* STATS OVERVIEW CARDS */}
          <section className="stats-row">
            <div className="stat-card orders">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.ordersCount}</h3>
                <p>Total Orders Placed</p>
              </div>
            </div>

            <div className="stat-card cart">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <h3>{stats.cartItemsCount}</h3>
                <p>Items in Your Cart</p>
              </div>
            </div>

            <div className="stat-card status">
              <div className="stat-icon">✨</div>
              <div className="stat-info">
                <h3>Active</h3>
                <p>Account Standing</p>
              </div>
            </div>
          </section>

          {/* MAIN INFO SECTION CARD */}
          <div className="account-details-card">
            
            {!editMode ? (
              /* VIEW PROFILE MODE */
              <>
                <div className="card-header-row">
                  <h2>👤 Account Information</h2>
                  <button onClick={() => setEditMode(true)} className="edit-profile-btn">
                    ✏️ Edit Profile
                  </button>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <div className="detail-value">{profile.username}</div>
                  </div>

                  <div className="detail-item">
                    <label>Email Address</label>
                    <div className="detail-value">{profile.email}</div>
                  </div>

                  <div className="detail-item">
                    <label>Mobile Number</label>
                    <div className="detail-value">
                      {profile.mobile ? (
                        profile.mobile
                      ) : (
                        <span className="profile-fallback-text">Not registered yet</span>
                      )}
                    </div>
                  </div>

                  <div className="detail-item full-width">
                    <label>Default Shipping Address</label>
                    <div className="detail-value address-value">
                      {profile.address ? (
                        profile.address
                      ) : (
                        <span className="profile-fallback-text">No delivery address set. Click 'Edit Profile' to add one.</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* EDIT PROFILE MODE */
              <>
                <div className="card-header-row">
                  <h2>✏️ Edit Profile Information</h2>
                </div>

                <div className="details-form">
                  <div className="form-group-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Email Address (Cannot change)</label>
                    <input
                      type="text"
                      value={profile.email}
                      disabled
                      className="disabled-input"
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      value={form.mobile || ""}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="10-digit number"
                    />
                  </div>

                  <div className="form-group-field full-width">
                    <label>Shipping Address</label>
                    <textarea
                      value={form.address || ""}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street name, landmark, city, state, pincode..."
                    ></textarea>
                  </div>
                </div>

                <div className="profile-actions-buttons">
                  <button onClick={handleSave} className="action-btn save">
                    💾 Save Changes
                  </button>
                  <button onClick={() => setEditMode(false)} className="action-btn cancel">
                    Cancel
                  </button>
                </div>
              </>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};

export default Profile;
