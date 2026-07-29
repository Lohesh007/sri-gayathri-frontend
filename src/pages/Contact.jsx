// src/pages/Contact.jsx
import React, { useState, useContext } from "react";
import { ModalContext } from "../context/ModalContext";
import "../styles/AboutContact.css";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const { showAlert } = useContext(ModalContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };

    emailjs
      .send(
        "service_cl5hd1o", // service ID
        "template_ip6lsba", // template ID
        templateParams,
        "x4iB2upm4eKk0uIAR" // public key
      )
      .then(
        () => {
          setSending(false);
          showAlert({
            title: "Message Sent! ✉️",
            message: "Thank you for reaching out! We have successfully received your inquiry and will get back to you shortly.",
            type: "success"
          });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setSending(false);
          showAlert({
            title: "Send Failed",
            message: "Failed to send your message. Please check your internet connection or reach us directly via WhatsApp / Phone Call.",
            type: "error"
          });
        }
      );
  };

  return (
    <div className="contact-page-wrapper">
      
      {/* HEADER SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">Contact Our Team</h1>
          <p className="about-hero-subtitle">
            Have queries about bulk orders, product customization, or store pick-up? We are here to help.
          </p>
        </div>
      </section>

      <div className="about-content-container">
        <div className="contact-grid-row">
          
          {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
          <div className="about-card contact-details-panel">
            <h2 className="about-section-title">📍 Store Location</h2>
            <p>
              <strong>Sri Gayathri Fancy & Religious</strong> <br />
              No.02, Annai Shopping Centre (North), Beach Road, <br />
              Velankanni, Nagapattinam, Tamil Nadu, India.
            </p>
            <p>
              <a
                href="https://maps.app.goo.gl/bDBFWkCmTeJLGbXz9"
                target="_blank"
                rel="noopener noreferrer"
                className="styled-link"
              >
                📍 Get Directions on Google Maps
              </a>
            </p>

            <hr className="divider-line" />

            <h2 className="about-section-title">📞 Connect Directly</h2>
            <p className="contact-item-row">
              <strong>WhatsApp & Calls:</strong>{" "}
              <a href="https://wa.me/919842004217" target="_blank" rel="noopener noreferrer">
                +91 9842004217
              </a>
            </p>
            <p className="contact-item-row">
              <strong>Landline support:</strong>{" "}
              <a href="tel:+919597580853">
                +91 9597580853
              </a>
            </p>
            <p className="contact-item-row">
              <strong>Instagram Handle:</strong>{" "}
              <a href="https://instagram.com/sri_gayathri_religious" target="_blank" rel="noopener noreferrer">
                @sri_gayathri_religious
              </a>
            </p>
          </div>

          {/* RIGHT COLUMN: INQUIRY FORM */}
          <div className="about-card contact-form-panel">
            <h2 className="about-section-title">✉️ Send an Inquiry</h2>
            <p>Fill out the form below and our store staff will email you back within 24 hours.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <textarea
                rows="5"
                placeholder="Type your message, query, or bulk request details here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              ></textarea>

              <button type="submit" className="submit-btn" disabled={sending}>
                {sending ? "Sending message..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
