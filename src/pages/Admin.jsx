import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import "../styles/AdminDashboard.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user } = useContext(AuthContext);
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

  const [form, setForm] = useState({
    name: "",
    category: "",
    subcategory: "",
    image: "",
    mrp: "",
    price: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthChecked(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) return navigate("/login");
    if (!user.isAdmin) {
      alert("Only admins can access this page.");
      return navigate("/");
    }

    fetchProducts();
    fetchCategories();
  }, [authChecked, user]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/categories");
    setCategories(res.data);
  };

  const handleCategoryChange = (cat) => {
    setForm({ ...form, category: cat, subcategory: "" });
    setSubList(categories[cat] || []);
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "ecommerce_images");

    const res = await fetch("https://api.cloudinary.com/v1_1/dontth6xt/image/upload", {
      method: "POST",
      body: data,
    });

    const uploaded = await res.json();
    return uploaded.secure_url || null;
  };

  const handleAdd = async () => {
    const imageURL = await uploadImage();
    if (!imageURL) return alert("Image upload failed");

    const finalForm = { ...form, image: imageURL };
    await API.post("/products/add", finalForm);

    resetForm();
    fetchProducts();
    alert("Product Added!");
  };

  const editProduct = (p) => {
    setEditMode(true);
    setEditId(p._id);
    setForm(p);
    setSubList(categories[p.category] || []);
  };

  const handleUpdate = async () => {
    const imageURL = await uploadImage();
    const finalForm = { ...form, image: imageURL };

    await API.put(`/products/${editId}`, finalForm);

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      subcategory: "",
      image: "",
      mrp: "",
      price: "",
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

  if (!authChecked) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all products efficiently</p>
      </div>

      <div className="admin-content">

        {/* LEFT: ADD / EDIT PRODUCT FORM */}
        <div className="admin-form-box">
          <h2>{editMode ? "Edit Product" : "Add Product"}</h2>

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={form.subcategory}
            onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
          >
            <option value="">Select Subcategory</option>
            {subList.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>

          <input
            placeholder="MRP"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

          {(imageFile || form.image) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.image}
              className="preview-img"
              alt="preview"
            />
          )}

          {editMode ? (
            <button className="btn purple" onClick={handleUpdate}>Save Changes</button>
          ) : (
            <button className="btn purple" onClick={handleAdd}>Add Product</button>
          )}

          {editMode && (
            <button className="btn gray" onClick={resetForm}>Cancel Edit</button>
          )}
        </div>

        {/* RIGHT: PRODUCT LIST */}
        <div className="admin-product-list">

          {/* SEARCH + FILTERS */}
          <div className="admin-filters">
            <input
              className="search-bar"
              placeholder="Search products..."
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
                <p className="price">₹{p.price}</p>

                <div className="actions">
                  <button className="btn small purple" onClick={() => editProduct(p)}>
                    Edit
                  </button>
                  <button className="btn small red" onClick={() => deleteProduct(p._id)}>
                    Delete
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
