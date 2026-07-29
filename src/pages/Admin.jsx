import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import "../styles/AdminDashboard.css";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { showAlert, showConfirm } = useContext(ModalContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [subList, setSubList] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSub, setFilterSub] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    image: "",
    imagesInput: "",
    mrp: "",
    price: "",
    stock: "",
    description: "",
  });

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthChecked(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) return navigate("/login");
    if (!user.isAdmin) {
      showAlert({
        title: "Access Denied",
        message: "Only admins can access this page.",
        type: "error",
        onConfirm: () => navigate("/")
      });
      return;
    }

    fetchProducts();
    fetchCategories();
  }, [authChecked, user, navigate, showAlert]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products list:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories list:", err);
    }
  };

  const handleCategoryChange = (cat) => {
    setForm({ ...form, category: cat, subcategory: "" });
    setSubList(categories[cat] || []);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      showAlert({ title: "Validation Error", message: "Product Name is required", type: "error" });
      return false;
    }
    if (!form.category) {
      showAlert({ title: "Validation Error", message: "Please select a Category", type: "error" });
      return false;
    }
    if (!form.subcategory) {
      showAlert({ title: "Validation Error", message: "Please select a Subcategory", type: "error" });
      return false;
    }
    
    const parsedMrp = parseFloat(form.mrp);
    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock, 10);

    if (isNaN(parsedMrp) || parsedMrp <= 0) {
      showAlert({ title: "Validation Error", message: "MRP must be a valid positive number", type: "error" });
      return false;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showAlert({ title: "Validation Error", message: "Selling Price must be a valid positive number", type: "error" });
      return false;
    }
    if (parsedPrice > parsedMrp) {
      showAlert({ title: "Validation Error", message: "Selling price cannot exceed the original MRP price", type: "error" });
      return false;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      showAlert({ title: "Validation Error", message: "Stock quantity cannot be negative", type: "error" });
      return false;
    }
    if (!editMode && !imageFile) {
      showAlert({ title: "Validation Error", message: "Please select a primary product image file to upload", type: "error" });
      return false;
    }
    return true;
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "ecommerce_images");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dontth6xt/image/upload", {
        method: "POST",
        body: data,
      });

      const uploaded = await res.json();
      return uploaded.secure_url || null;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return null;
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const imageURL = await uploadImage();
      if (!imageURL) {
        showAlert({
          title: "Upload Error",
          message: "Primary image upload to Cloudinary failed. Check file type/size.",
          type: "error"
        });
        setSubmitting(false);
        return;
      }

      const finalForm = { 
        ...form, 
        image: imageURL,
        images: form.imagesInput ? form.imagesInput.split(",").map(url => url.trim()).filter(Boolean) : []
      };
      await API.post("/products/add", finalForm);

      resetForm();
      fetchProducts();
      showAlert({
        title: "Success",
        message: "Product added successfully!",
        type: "success"
      });
    } catch (err) {
      console.error("Failed to add product:", err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to create product record",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const editProduct = (p) => {
    setEditMode(true);
    setEditId(p._id);
    setForm({
      ...p,
      imagesInput: p.images ? p.images.join(", ") : ""
    });
    setSubList(categories[p.category] || []);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const imageURL = await uploadImage();
      const finalForm = { 
        ...form, 
        image: imageURL || form.image,
        images: form.imagesInput ? form.imagesInput.split(",").map(url => url.trim()).filter(Boolean) : []
      };

      await API.put(`/products/${editId}`, finalForm);

      resetForm();
      fetchProducts();
      showAlert({
        title: "Success",
        message: "Product details updated successfully!",
        type: "success"
      });
    } catch (err) {
      console.error("Failed to update product:", err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to save product details",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    showConfirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action is permanent.",
      type: "warning",
      confirmText: "Yes, Delete",
      onConfirm: async () => {
        try {
          await API.delete(`/products/${id}`);
          fetchProducts();
          showAlert({
            title: "Deleted",
            message: "Product deleted successfully!",
            type: "success"
          });
        } catch (err) {
          console.error("Failed to delete product:", err);
          showAlert({
            title: "Error",
            message: "Failed to delete product from database",
            type: "error"
          });
        }
      }
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      subcategory: "",
      image: "",
      imagesInput: "",
      mrp: "",
      price: "",
      stock: "",
      description: "",
    });
    setEditMode(false);
    setImageFile(null);
  };

  // FILTER & SEARCH
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchSub = !filterSub || p.subcategory === filterSub;
    return matchSearch && matchCategory && matchSub;
  });

  if (!authChecked) return <div className="admin-loading">Checking administrative privileges...</div>;

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Storefront Dashboard</h1>
        <p>Manage all religious items catalog, prices, and stock inventory</p>
      </div>

      <div className="admin-content">

        {/* LEFT: ADD / EDIT PRODUCT FORM */}
        <div className="admin-form-box">
          <h2 className="form-box-title">{editMode ? "✏️ Edit Product Details" : "🆕 Add New Product"}</h2>

          <div className="admin-form-field">
            <label className="admin-field-label">Product Name</label>
            <input
              placeholder="e.g. Olive Wood Rosary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-field-label">Category</label>
            <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-field">
            <label className="admin-field-label">Subcategory</label>
            <select
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              disabled={!form.category}
            >
              <option value="">Select Subcategory</option>
              {subList.map((sub) => (
                <option key={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-field-row">
            <div className="admin-form-field">
              <label className="admin-field-label">MRP (Original Price)</label>
              <input
                placeholder="₹ MRP"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-field-label">Selling Price</label>
              <input
                placeholder="₹ Selling Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label className="admin-field-label">Stock Quantity</label>
            <input
              placeholder="e.g. 50"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-field-label">Product Description</label>
            <textarea
              placeholder="Write product specifications and dimensions..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-field-label">Additional Image URLs (Comma Separated)</label>
            <input
              placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg"
              value={form.imagesInput || ""}
              onChange={(e) => setForm({ ...form, imagesInput: e.target.value })}
            />
          </div>

          <div className="admin-form-field file-upload-field">
            <label className="admin-field-label">Product Image File</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="file-input" />
            <span className="file-help-text">JPG, JPEG or PNG formats supported.</span>
          </div>

          {(imageFile || form.image) && (
            <div className="preview-container">
              <label className="admin-field-label">Image Preview</label>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                className="preview-img"
                alt="preview"
              />
            </div>
          )}

          <div className="admin-form-actions">
            {editMode ? (
              <button className="btn purple" onClick={handleUpdate} disabled={submitting}>
                {submitting ? "Uploading & Saving..." : "💾 Save Changes"}
              </button>
            ) : (
              <button className="btn purple" onClick={handleAdd} disabled={submitting}>
                {submitting ? "Uploading & Adding..." : "➕ Add Product"}
              </button>
            )}

            {editMode && (
              <button className="btn gray" onClick={resetForm} disabled={submitting}>
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: PRODUCT LIST */}
        <div className="admin-product-list">
          {/* SEARCH + FILTERS */}
          <div className="admin-filters">
            <input
              className="search-bar"
              placeholder="Search catalog products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setFilterSub("");
              }}
            >
              <option value="All">All Categories</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            {filterCategory !== "All" && (
              <select value={filterSub} onChange={(e) => setFilterSub(e.target.value)}>
                <option value="">All Subcategories</option>
                {categories[filterCategory]?.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div className="admin-grid">
            {filteredProducts.map((p) => (
              <div className="admin-card" key={p._id}>
                <img src={p.image} alt={p.name} />

                <h4>{p.name}</h4>
                <p className="price">₹{p.price} <span className="admin-mrp-strike">₹{p.mrp}</span></p>
                <p className="admin-stock-display">Stock: <strong>{p.stock}</strong></p>

                <div className="actions">
                  <button className="btn small purple" onClick={() => editProduct(p)} disabled={submitting}>
                    ✏️ Edit
                  </button>
                  <button className="btn small red" onClick={() => deleteProduct(p._id)} disabled={submitting}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
