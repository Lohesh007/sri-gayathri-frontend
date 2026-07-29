import React, { createContext, useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // "success", "error", "warning", "info"
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: null,
    onCancel: null,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showAlert = ({ title = "Alert", message, type = "info", confirmText = "OK", onConfirm }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: null, // setting to null indicates Alert mode (no cancel button)
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: null,
    });
  };

  const showConfirm = ({
    title = "Confirm",
    message,
    type = "warning",
    confirmText = "Yes, Continue",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        closeModal();
      },
    });
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modal.isOpen && (
        <ConfirmationModal
          title={modal.title}
          message={modal.message}
          type={modal.type}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </ModalContext.Provider>
  );
};
