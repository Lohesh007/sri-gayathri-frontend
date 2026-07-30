const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Set CORS headers for Netlify functions
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { to, subject, html, secret } = JSON.parse(event.body);

    const apiSecret = process.env.EMAIL_API_SECRET || "sri-gayathri-secret-email-key-2026";
    if (secret !== apiSecret) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Forbidden: Invalid Secret" }),
      };
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "SMTP Credentials not configured on Netlify" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `Sri Gayathri Religious <${emailUser}>`,
      to,
      subject,
      html,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (err) {
    console.error("Netlify email function failed:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
