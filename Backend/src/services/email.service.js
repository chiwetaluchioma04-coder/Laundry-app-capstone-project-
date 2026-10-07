const nodemailer = require("nodemailer");

const getMailConfig = () => {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "FRONTEND_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    const err = new Error(`Password reset email is not configured: missing ${missing.join(", ")}`);
    err.statusCode = 503;
    throw err;
  }

  let frontendUrl;
  try {
    frontendUrl = new URL(process.env.FRONTEND_URL);
  } catch {
    const err = new Error("FRONTEND_URL must be a valid URL");
    err.statusCode = 503;
    throw err;
  }
  if (!["http:", "https:"].includes(frontendUrl.protocol)) {
    const err = new Error("FRONTEND_URL must use HTTP or HTTPS");
    err.statusCode = 503;
    throw err;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    const err = new Error("SMTP_PORT must be a valid TCP port");
    err.statusCode = 503;
    throw err;
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    from: process.env.MAIL_FROM,
    frontendUrl,
  };
};

const assertMailConfigured = () => getMailConfig();

const sendPasswordResetEmail = async ({ email, resetToken }) => {
  const config = getMailConfig();
  const resetUrl = new URL("/reset-password", config.frontendUrl);
  resetUrl.searchParams.set("token", resetToken);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject: "Reset your FreshFold password",
    text: `Use this link to reset your FreshFold password. It expires in 15 minutes:\n\n${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>We received a request to reset your FreshFold password.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`,
  });
};

module.exports = { assertMailConfigured, sendPasswordResetEmail };
