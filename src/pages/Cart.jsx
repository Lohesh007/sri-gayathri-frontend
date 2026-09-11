// src/pages/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setCartCount } = useContext(AuthContext);
  const { showAlert, showConfirm } = useContext(ModalContext);

  // Load Cart + User Profile
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const cartRes = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRes = await API.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = cartRes.data?.items || [];
        setCart(items);
        setUser(userRes.data);

        const totalAmount = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotal(totalAmount);

        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      } catch (err) {
        console.error("Failed to load cart details:", err);
      }
    };

    fetchData();
  }, [token, navigate, setCartCount]);

  // Quantity update
  const updateQty = async (id, qty) => {
    if (qty < 1) return;

    // Find the item in state to check stock levels
    const item = cart.find((i) => i._id === id);
    const stock = item?.productId?.stock ?? 999;

    if (qty > stock) {
      showAlert({
        title: "Insufficient Stock",
        message: `Sorry, only ${stock} items are available in stock.`,
        type: "warning"
      });
      return;
    }

    try {
      await API.put(
        `/cart/update/${id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItems = cart.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      );
      setCart(updatedItems);
      setCartCount(updatedItems.reduce((sum, item) => sum + item.quantity, 0));

      setTotal(
        updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      );
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      showAlert({
        title: "Error",
        message: "Failed to update quantity.",
        type: "error"
      });
    }
  };

  // Remove item
  const removeItem = async (id) => {
    showConfirm({
      title: "Remove Item",
      message: "Are you sure you want to remove this item from your cart?",
      type: "warning",
      confirmText: "Yes, Remove",
      onConfirm: async () => {
        try {
          await API.delete(`/cart/remove/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const updated = cart.filter((i) => i._id !== id);
          setCart(updated);
          setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0));
          setTotal(updated.reduce((sum, item) => sum + item.price * item.quantity, 0));
        } catch (err) {
          console.error("Remove item error:", err);
          showAlert({
            title: "Error",
            message: "Failed to remove item from cart",
            type: "error"
          });
        }
      }
    });
  };

  // Save edited user details
  const saveDetails = async () => {
    if (!user.username.trim()) {
      showAlert({ title: "Validation Error", message: "Name cannot be empty", type: "error" });
      return;
    }
    if (!/^\d{10}$/.test(user.mobile)) {
      showAlert({ title: "Validation Error", message: "Please enter a valid 10-digit mobile number", type: "error" });
      return;
    }
    if (!user.address.trim()) {
      showAlert({ title: "Validation Error", message: "Delivery address cannot be empty", type: "error" });
      return;
    }

    try {
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
      showAlert({
        title: "Success",
        message: "Shipping details updated successfully!",
        type: "success"
      });
    } catch (err) {
      console.error("Save profile details error:", err);
      showAlert({
        title: "Error",
        message: err.response?.data?.message || "Failed to update details",
        type: "error"
      });
    }
  };

  // Pay Now
  const payNow = async () => {
    showConfirm({
      title: "Confirm Order & Pay",
      message: `Are you sure you want to place this order and proceed to payment of ₹${total}?`,
      type: "info",
      confirmText: "Yes, Pay Now",
      onConfirm: async () => {
        try {
          const res = await API.post(
            "/payment/create-order",
            { deliveryInstructions },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const { orderId, amount } = res.data;

          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_TabhXgQW1bkcGx",
            amount: amount * 100, // in paise
            currency: "INR",
            name: "Sri Gayathri Religious",
            description: "Checkout Payment",
            order_id: orderId,

            handler: async (response) => {
              try {
                await API.post(
                  "/orders/place",
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    deliveryInstructions,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                setCartCount(0); // clear cart count on successful placement
                setConfirmOpen(false);
                showAlert({
                  title: "Success",
                  message: "Order placed successfully!",
                  type: "success",
                  onConfirm: () => navigate("/orders")
                });
              } catch (verifyErr) {
                console.error("Order placement/verification error:", verifyErr);
                showAlert({
                  title: "Verification Failed",
                  message: "Payment verification failed! Please contact support.",
                  type: "error"
                });
              }
            },

            theme: { color: "#5e0099" },
          };

          new window.Razorpay(options).open();
        } catch (err) {
          console.error("Razorpay order creation failed:", err);
          showAlert({
            title: "Payment Error",
            message: "Payment Failed",
            type: "error"
          });
        }
      }
    });
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
      {cart.map((item) => {
        const stock = item.productId?.stock ?? 999;
        return (
          <div className="cart-item" key={item._id}>
            <img src={item.image} alt={item.name} />

            <div className="cart-details">
              <h3>{item.name}</h3>
              <p className="item-price">₹{item.price}</p>

              {/* Quantity Controls */}
              <div className="qty-box">
                <button 
                  onClick={() => updateQty(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  –
                </button>

                <span>{item.quantity}</span>

                <button 
                  onClick={() => updateQty(item._id, item.quantity + 1)}
                  disabled={item.quantity >= stock}
                >
                  +
                </button>
              </div>

              <button className="remove-btn" onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </div>
          </div>
        );
      })}

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
            <h2 className="confirm-title">✨ Checkout Confirmation</h2>

            {/* NOT EDITING VIEW */}
            {!editing ? (
              <>
                <div className="checkout-summary-section">
                  <h4 className="section-subtitle">📍 Shipping Details</h4>
                  <div className="confirm-info">
                    <p><strong>Name:</strong> {user.username}</p>
                    <p><strong>Mobile:</strong> {user.mobile}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    {deliveryInstructions && (
                      <p className="confirm-instr-note"><strong>Note:</strong> "{deliveryInstructions}"</p>
                    )}
                  </div>
                </div>

                <div className="checkout-summary-section">
                  <h4 className="section-subtitle">🛒 Items Review</h4>
                  <div className="checkout-items-list">
                    {cart.map((item) => (
                      <div className="checkout-item-row" key={item._id}>
                        <img src={item.image} alt={item.name} className="checkout-item-thumb" />
                        <div className="checkout-item-info">
                          <span className="checkout-item-name">{item.name}</span>
                          <span className="checkout-item-qty-price">
                            {item.quantity} x ₹{item.price} = <strong>₹{item.price * item.quantity}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="confirm-total">
                  Total Payable: <span>₹{total}</span>
                </h3>

                <div className="confirm-actions">
                  <button className="checkout-modal-btn gold" onClick={payNow}>
                    ✔ Confirm & Pay
                  </button>

                  <button className="checkout-modal-btn purple" onClick={() => setEditing(true)}>
                    ✏ Edit Details
                  </button>

                  <button className="checkout-modal-btn cancel" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* EDIT MODE */}
                <h3 className="edit-title">✏ Edit Delivery Details</h3>

                <div className="checkout-edit-field">
                  <label className="checkout-edit-label">👤 Recipient Name</label>
                  <input
                    className="edit-input"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Enter recipient's full name"
                  />
                </div>

                <div className="checkout-edit-field">
                  <label className="checkout-edit-label">📞 Contact Mobile Number</label>
                  <input
                    className="edit-input"
                    type="text"
                    value={user.mobile}
                    onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="checkout-edit-field address-field">
                  <label className="checkout-edit-label delivery-address-header">📍 Complete Delivery Address (Required)</label>
                  <textarea
                    className="edit-textarea"
                    value={user.address}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    placeholder="Enter your complete house number, street details, landmark, city, state, and pincode..."
                  />
                  <span className="address-warning-note">
                    ⚠️ Please double-check your pincode and street address to guarantee smooth delivery.
                  </span>
                </div>

                <div className="checkout-edit-field">
                  <label className="checkout-edit-label">📝 Special Delivery Instructions (Optional)</label>
                  <input
                    className="edit-input"
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Leave with neighbor, Ring bell, Call before arrival..."
                  />
                </div>

                <div className="confirm-actions">
                  <button className="checkout-modal-btn gold" onClick={saveDetails}>
                    💾 Save Details
                  </button>

                  <button className="checkout-modal-btn cancel" onClick={() => setEditing(false)}>
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
