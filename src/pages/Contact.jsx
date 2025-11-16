// src/pages/Contact.jsx
import React, { useState } from "react";
import "../styles/AboutContact.css";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };

    emailjs
      .send(
        "service_cl5hd1o", // your service ID
        "template_ip6lsba", // your template ID
        templateParams,
        "x4iB2upm4eKk0uIAR" // your public key
      )
      .then(
        () => {
          setStatus("Message sent successfully! We will contact you soon.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("Failed to send message. Try again.");
        }
      );
  };

  return (
    <div className="about-container">
      <h1 className="page-title">Contact Us</h1>

      <section className="section">
        <h2>Our Address</h2>
        <p>
          📍 No.02, Annai Shopping Centre (North), Beach Road, Velankanni,
          Nagapattinam <br />
          <a
            href="https://maps.app.goo.gl/bDBFWkCmTeJLGbXz9"
            target="_blank"
            rel="noopener noreferrer"
            className="styled-link"
          >
            📌 View on Google Maps
          </a>
        </p>
      </section>

      <section className="section">
        <h2>Reach Us</h2>
        <p>
          📞 Mobile / WhatsApp:{" "}
          <a
            href="https://wa.me/919842004217"
            target="_blank"
            rel="noopener noreferrer"
          >
            +91 9842004217
          </a>
        </p>
        <p>
          📸 Instagram:{" "}
          <a
            href="https://instagram.com/sri_gayathri_religious"
            target="_blank"
            rel="noopener noreferrer"
          >
            @sri_gayathri_religious
          </a>
        </p>

        <img
          src="/assets/images/instagram_qr.png"
          alt="Instagram QR"
          className="qr-code"
        />
      </section>

      <section className="section">
        <h2>Send Us a Message</h2>

        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <textarea
            rows="5"
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          ></textarea>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        {status && <p className="status-message">{status}</p>}
      </section>
    </div>
  );
};

export default Contact;
