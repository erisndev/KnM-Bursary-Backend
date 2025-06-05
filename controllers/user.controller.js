const User = require("../models/user.model.js"); // Adjust the path as necessary
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sendEmail, emailTemplates } = require("../utils/sendEmail.js");

// Registration logic
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login logic
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// forgot password function
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store hashed code in DB (recommended)
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    // Set expiry for code
    user.resetCode = hashedCode;
    user.resetCodeExpires = Date.now() + 60 * 60 * 1000; // 60 min
    await user.save();

    // Get email template
    const emailContent = emailTemplates.passwordReset(code, user.firstName);

    // Send professional email
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log("Password reset email sent successfully to:", email);

    res.status(200).json({
      message:
        "A verification code has been sent to your email address. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({
      message:
        "We're experiencing technical difficulties. Please try again later or contact support if the problem persists.",
    });
  }
};

const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpires)
      return res.status(400).json({ message: "Invalid request" });

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    if (user.resetCode !== hashedCode)
      return res.status(400).json({ message: "Invalid code" });

    if (Date.now() > user.resetCodeExpires)
      return res.status(400).json({ message: "Code has expired" });

    // Optional: mark verified flag or return token
    user.isCodeVerified = true;
    await user.save();

    res.status(200).json({ message: "Code verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ message: "Email and new password required" });

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isCodeVerified)
      return res.status(400).json({ message: "Unauthorized or invalid user" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    user.isCodeVerified = false;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
