// src/pages/AdminOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/admin-orders.css";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Redirect if NOT admin
  useEffect(() => {
    if (!user) return navigate("/login");
    if (!user.isAdmin) {
      alert("Access Denied — Admin Only");
      return navigate("/");
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/all");
      setOrders(res.data || []);
    } catch (err) {
      alert("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setSavingId(orderId);
      await API.put(`/orders/status/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (!query) return true;

    const q = query.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.mobile?.includes(q)
    );
  });

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h2>Admin — Orders Dashboard</h2>

        <div className="admin-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <input
            placeholder="Search by ID, name, or mobile"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="refresh-btn" onClick={fetchOrders}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No orders found</div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td>
                    <b>#{o._id.slice(-6)}</b>
                    <div className="small">{o._id}</div>
                  </td>

                  <td>
                    <b>{o.customerName}</b>
                    <div className="small">{o.mobile}</div>
                    <div className="small">{o.address}</div>
                  </td>

                  <td>₹{o.totalAmount}</td>

                  <td className="items-cell">
                    {o.items.slice(0, 3).map((it) => (
                      <div className="item-row" key={it._id}>
                        <img src={it.image} alt={it.name} />
                        <span>{it.name} x{it.quantity}</span>
                      </div>
                    ))}
                    {o.items.length > 3 && (
                      <span className="more-items">+ {o.items.length - 3} more</span>
                    )}
                  </td>

                  <td>
                    <div className={`status-badge ${o.status.toLowerCase()}`}>
                      {o.status}
                    </div>
                  </td>

                  <td>{new Date(o.createdAt).toLocaleString()}</td>

                  <td>
                    <select
                      defaultValue={o.status}
                      disabled={savingId === o._id}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
