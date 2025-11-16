// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load Cart + User Profile
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      const cartRes = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userRes = await API.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(cartRes.data?.items || []);
      setUser(userRes.data);

      const totalAmount = (cartRes.data?.items || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(totalAmount);
    };

    fetchData();
  }, [token, navigate]);

  // Quantity update
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    await API.put(
      `/cart/update/${id}`,
      { quantity: qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );

    setTotal(
      cart.reduce(
        (sum, item) =>
          sum + (item._id === id ? item.price * qty : item.price * item.quantity),
        0
      )
    );
  };

  // Remove item
  const removeItem = async (id) => {
    await API.delete(`/cart/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updated = cart.filter((i) => i._id !== id);
    setCart(updated);

    setTotal(updated.reduce((sum, item) => sum + item.price * item.quantity, 0));
  };

  // Save edited user details
  const saveDetails = async () => {
    await API.put(
      "/users/update-profile",
      {
        username: user.username,
        mobile: user.mobile,
        address: user.address,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditing(false);
  };

  // Payment
  const payNow = async () => {
    try {
      const res = await API.post(
        "/payment/create-order",
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId } = res.data;

      const options = {
        key: "rzp_test_RetmJzKdi8jFB5",
        amount: total * 100,
        currency: "INR",
        name: "Sri Gayathri Religious",
        description: "Checkout Payment",
        order_id: orderId,

        handler: async (response) => {
          await API.post(
            "/payment/verify",
            { ...response, cartItems: cart },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          await API.post(
            "/orders/place",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          alert("Order placed successfully!");
          navigate("/orders");
        },

        theme: { color: "#5e0099" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert("Payment Failed");
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {/* Empty Cart */}
      {cart.length === 0 && (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="gold-btn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      )}

      {/* Cart Items */}
      {cart.map((item) => (
        <div className="cart-item" key={item._id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-details">
            <h3>{item.name}</h3>

            <p className="item-price">₹{item.price}</p>

            {/* Quantity Controls */}
            <div className="qty-box">
              <button onClick={() => updateQty(item._id, item.quantity - 1)}>
                –
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQty(item._id, item.quantity + 1)}>
                +
              </button>
            </div>

            <button className="remove-btn" onClick={() => removeItem(item._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Summary */}
      {cart.length > 0 && (
        <div className="summary-box">
          <h2>Order Summary</h2>
          <p><strong>Items:</strong> {cart.length}</p>
          <p><strong>Total:</strong> ₹{total}</p>

          <button className="gold-btn" onClick={() => setConfirmOpen(true)}>
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmOpen && user && (
  <div className="confirm-overlay">
    <div className="confirm-box">

      <h2 className="confirm-title">✨ Confirm Your Order</h2>

      {/* NOT EDITING VIEW */}
      {!editing ? (
        <>
          <div className="confirm-info">
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>

          <h3 className="confirm-total">
            Total Payable: <span>₹{total}</span>
          </h3>

          <div className="confirm-actions">
            <button className="gold-btn large" onClick={payNow}>
              ✔ Confirm & Pay
            </button>

            <button className="purple-btn" onClick={() => setEditing(true)}>
              ✏ Edit Details
            </button>

            <button className="cancel-btn" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* EDIT MODE */}
          <h3 className="edit-title">Edit Your Details</h3>

          <input
            className="edit-input"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Full Name"
          />

          <input
            className="edit-input"
            type="text"
            value={user.mobile}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            placeholder="Mobile Number"
          />

          <textarea
            className="edit-textarea"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            placeholder="Complete Address"
          />

          <div className="confirm-actions">
            <button className="gold-btn large" onClick={saveDetails}>
              💾 Save & Continue
            </button>

            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </>
      )}

    </div>
  </div>
)}

    </div>
  );
};

export default Cart;
