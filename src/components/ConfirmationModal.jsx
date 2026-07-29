import React from "react";
import "../styles/ConfirmationModal.css";

const ConfirmationModal = ({
  title = "Notification",
  message,
  type = "info", // "success", "error", "warning", "info"
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✨";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className={`modal-icon ${type}`}>{getIcon()}</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className={`confirm-btn ${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
          {onCancel && (
            <button className="cancel-btn" onClick={onCancel}>
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
