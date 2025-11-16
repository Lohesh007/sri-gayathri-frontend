import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const Profile = () => {
  const { token, updateUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await API.get("/users/profile");
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!profile) return <div className="profile-loading">Unable to load profile.</div>;

  const handleSave = async () => {
    try {
      const res = await API.put("/users/update-profile", {
        username: form.username,
        mobile: form.mobile,
        address: form.address,
      });

      updateUser(res.data.user);
      setProfile(res.data.user);
      setEditMode(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profile-container">

      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.username[0].toUpperCase()}
          </div>
          <h2>{profile.username}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>

        {/* VIEW MODE */}
        {!editMode ? (
          <>
            <div className="profile-info">
              <p><span>Name:</span> {profile.username}</p>
              <p><span>Mobile:</span> {profile.mobile}</p>
              <p><span>Address:</span> {profile.address}</p>
            </div>

            <button onClick={() => setEditMode(true)} className="profile-btn">
              Edit Profile
            </button>
          </>
        ) : (
          /* EDIT MODE */
          <>
            <div className="profile-form">

              <label>Name</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <label>Mobile</label>
              <input
                type="text"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />

              <label>Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              ></textarea>
            </div>

            <button onClick={handleSave} className="profile-btn save">
              Save Changes
            </button>

            <button onClick={() => setEditMode(false)} className="profile-btn cancel">
              Cancel
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Profile;
