import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/ecommerce.css";

const Orders = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchOrders = async () => {
      const res = await API.get("/orders");
      setOrders(res.data);
    };

    fetchOrders();
  }, [token, navigate]);

  // Cancel Order Function
  const cancelOrder = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    try {
      await API.put(`/orders/cancel/${id}`);
      alert("Order cancelled successfully!");
      setOrders(orders.map(o => o._id === id ? { ...o, status: "Cancelled" } : o));
    } catch (err) {
      console.error(err);
      alert("Cannot cancel this order.");
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

            <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
            <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Delivery Details</h4>
            <div className="order-address">
              <p><b>Name:</b> {order.userDetails?.username}</p>
              <p><b>Mobile:</b> {order.userDetails?.mobile}</p>
              <p><b>Address:</b> {order.userDetails?.address}</p>
            </div>

            <h4>Items</h4>
            {order.items.map((item) => (
              <div className="order-item" key={item._id}>
                <img src={item.image} alt={item.name} className="order-img" />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}

            {order.status !== "Cancelled" && order.status !== "Shipped" && (
              <button
                className="cancel-order-btn"
                onClick={() => cancelOrder(order._id)}
              >
                ❌ Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
