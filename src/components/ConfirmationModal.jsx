import React from "react";
import "../styles/ConfirmationModal.css";

const ConfirmationModal = ({ title = "Confirm Action", message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">

      <div className="modal-box">

        {/* Icon */}
        <div className="modal-icon">⚠️</div>

        {/* Title */}
        <h2 className="modal-title">{title}</h2>

        {/* Message */}
        <p className="modal-message">{message}</p>

        {/* Buttons */}
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            ✔ Yes, Continue
          </button>

          <button className="cancel-btn" onClick={onCancel}>
            ✖ Cancel
          </button>
        </div>

      </div>

    </div>
  );
};

export default ConfirmationModal;
