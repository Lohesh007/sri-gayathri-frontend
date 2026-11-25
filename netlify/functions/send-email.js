const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": event.headers?.origin === "https://www.srigayathrireligious.com" || event.headers?.origin === "https://srigayathrireligious.com" ? event.headers.origin : "https://sri-gayathri-fancy-religious.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };

  try {
    const payload = JSON.parse(event.body || "{}");
    const { to, subject, html, secret } = payload;
    const apiSecret = process.env.EMAIL_API_SECRET;
    if (!apiSecret || !secret || secret !== apiSecret) return { statusCode: 403, headers, body: JSON.stringify({ error: "Forbidden" }) };
    if (typeof to !== "string" || to.length > 254 || typeof subject !== "string" || subject.length > 200 || typeof html !== "string" || html.length > 100000) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email payload" }) };
    }
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) return { statusCode: 500, headers, body: JSON.stringify({ error: "Email service is not configured" }) };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: emailUser, pass: emailPass },
    });
    await transporter.sendMail({ from: `Sri Gayathri Religious <${emailUser}>`, to, subject, html });
    return { statusCode: 200, headers, body: JSON.stringify({ message: "Email sent successfully" }) };
  } catch (err) {
    console.error("Netlify email function failed:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Email delivery failed" }) };
  }
};
