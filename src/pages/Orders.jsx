import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/ModalContext";
import "../styles/ecommerce.css";
import "../styles/orders.css";

const Orders = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { showAlert, showConfirm } = useContext(ModalContext);

  // States for order shipping editing modal
  const [editingOrder, setEditingOrder] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders list:", err);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  // Cancel Order Function
  const cancelOrder = async (id) => {
    showConfirm({
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order?",
      type: "warning",
      confirmText: "Yes, Cancel Order",
      onConfirm: async () => {
        try {
          await API.put(`/orders/cancel/${id}`);
          showAlert({
            title: "Success",
            message: "Order cancelled successfully!",
            type: "success"
          });
          setOrders(orders.map(o => o._id === id ? { ...o, status: "Cancelled" } : o));
        } catch (err) {
          console.error(err);
          showAlert({
            title: "Error",
            message: "Cannot cancel this order.",
            type: "error"
          });
        }
      }
    });
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditName(order.customerName || "");
    setEditMobile(order.mobile || "");
    setEditAddress(order.address || "");
    setEditInstructions(order.deliveryInstructions || "");
  };

  const saveShippingDetails = async () => {
    if (!editAddress.trim()) {
      showAlert({ title: "Validation Error", message: "Delivery address cannot be empty", type: "error" });
      return;
    }
    if (!/^\d{10}$/.test(editMobile)) {
      showAlert({ title: "Validation Error", message: "Please enter a valid 10-digit mobile number", type: "error" });
      return;
    }
    if (!editName.trim()) {
      showAlert({ title: "Validation Error", message: "Name cannot be empty", type: "error" });
      return;
    }

    try {
      await API.put(`/orders/${editingOrder._id}/update-shipping`, {
        customerName: editName,
        mobile: editMobile,
        address: editAddress,
        deliveryInstructions: editInstructions,
      });

      showAlert({
        title: "Success",
        message: "Shipping details updated successfully!",
        type: "success"
      });

      setOrders(
        orders.map((o) =>
          o._id === editingOrder._id
            ? {
                ...o,
                customerName: editName,
                mobile: editMobile,
                address: editAddress,
                deliveryInstructions: editInstructions,
              }
            : o
        )
      );

      setEditingOrder(null);
    } catch (err) {
      console.error("Update shipping details error:", err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to update shipping details",
        type: "error"
      });
    }
  };

  // Status Icons
  const statusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="status delivered">✔ Delivered</span>;
      case "Shipped":
        return <span className="status shipped">🚚 Shipped</span>;
      case "Processing":
        return <span className="status processing">⏳ Processing</span>;
      case "Cancelled":
        return <span className="status cancelled">❌ Cancelled</span>;
      default:
        return <span className="status placed">✔ Order Placed</span>;
    }
  };

  // Status timeline rendering helper
  const renderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="order-timeline cancelled">
          <div className="timeline-step completed active cancelled">
            <div className="step-dot" />
            <span className="step-text">Order Cancelled</span>
          </div>
        </div>
      );
    }

    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="order-timeline">
        <div className="timeline-progress-bar">
          <div 
            className="timeline-progress-fill" 
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="timeline-steps">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isActive = index === currentIndex;
            return (
              <div 
                key={step} 
                className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
              >
                <div className="step-dot" />
                <span className="step-text">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders-box">
          <h3>You haven't placed any orders yet.</h3>
          <p>Start exploring our divine collection!</p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/products")}
          >
            🛍️ Continue Shopping
          </button>
        </div>  
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              {statusIcon(order.status)}
            </div>

            {/* Visual Tracking Timeline */}
            {renderTimeline(order.status)}

            <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
            <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>

            <h4>Delivery Details</h4>
            <div className="order-address">
              <p><b>Name:</b> {order.customerName}</p>
              <p><b>Mobile:</b> {order.mobile}</p>
              <p><b>Address:</b> {order.address}</p>
              {order.deliveryInstructions && (
                <p className="order-instr-display">
                  <b>Delivery Instructions:</b> "{order.deliveryInstructions}"
                </p>
              )}
            </div>

            <h4>Items (Click to view product)</h4>
            {order.items.map((item) => (
              <div 
                className="order-item clickable-item" 
                key={item._id}
                onClick={() => item.productId && navigate(`/product/${item.productId}`)}
              >
                <img src={item.image} alt={item.name} className="order-img" />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}

            {/* Actions Row */}
            {order.status !== "Cancelled" && order.status !== "Shipped" && order.status !== "Delivered" && (
              <div className="order-actions-row">
                <button
                  className="edit-shipping-btn"
                  onClick={() => openEditModal(order)}
                >
                  ✏️ Edit Shipping
                </button>
                <button
                  className="cancel-order-btn"
                  onClick={() => cancelOrder(order._id)}
                >
                  ❌ Cancel Order
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* EDIT SHIPPING DETAILS MODAL POPUP */}
      {editingOrder && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h2 className="confirm-title">✏️ Edit Shipping Address</h2>
            <p className="edit-modal-subtitle">Update delivery information for Order #{editingOrder._id.slice(-6)}</p>

            <div className="checkout-edit-field">
              <label className="checkout-edit-label">👤 Recipient Name</label>
              <input
                className="edit-input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Recipient name"
              />
            </div>

            <div className="checkout-edit-field">
              <label className="checkout-edit-label">📞 Contact Mobile Number</label>
              <input
                className="edit-input"
                type="text"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                placeholder="10-digit phone number"
              />
            </div>

            <div className="checkout-edit-field address-field">
              <label className="checkout-edit-label delivery-address-header">📍 Complete Delivery Address (Required)</label>
              <textarea
                className="edit-textarea"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Complete street, landmarks, city, pincode..."
              />
              <span className="address-warning-note">
                ⚠️ Make sure address details are correct. Shipping labels cannot be changed once dispatch begins.
              </span>
            </div>

            <div className="checkout-edit-field">
              <label className="checkout-edit-label">📝 Delivery Instructions (Optional)</label>
              <input
                className="edit-input"
                type="text"
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                placeholder="e.g. Leave with security, Ring bell..."
              />
            </div>

            <div className="confirm-actions">
              <button className="checkout-modal-btn gold" onClick={saveShippingDetails}>
                💾 Save Details
              </button>

              <button className="checkout-modal-btn cancel" onClick={() => setEditingOrder(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
