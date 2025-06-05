const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require("./routes/user.route.js");
const bursaryRoutes = require("./routes/applicant.route.js");
const adminRoutes = require("./routes/admin.route.js");

dotenv.config();

const app = express();

// Allowed frontend URLs for CORS
const allowedOrigins = [process.env.FRONTEND_URL, process.env.Sec_FRONTEND_URL];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Explicitly handle OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/applications", bursaryRoutes);
app.use("/api/admin", adminRoutes);

// Root route for health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res
      .status(403)
      .json({ message: "CORS Error: This origin is not allowed" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
