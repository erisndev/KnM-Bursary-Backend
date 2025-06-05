const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Cloudinary configuration (if used)
console.log("Cloudinary configured successfully");

// Allowed frontend URLs for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.Sec_FRONTEND_URL,
].filter(Boolean); // Remove undefined values

// CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Middleware to parse JSON body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Root route for health check
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Load routes with error handling
try {
  const userRoutes = require("./routes/user.route.js");
  const bursaryRoutes = require("./routes/applicant.route.js");
  const adminRoutes = require("./routes/admin.route.js");

  // API routes
  app.use("/api/users", userRoutes);
  app.use("/api/applications", bursaryRoutes);
  app.use("/api/admin", adminRoutes);
} catch (error) {
  console.error("Error loading routes:", error.message);
  console.error(
    "Please check your route files for syntax errors or invalid route patterns"
  );
  process.exit(1);
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS Error: This origin is not allowed",
      origin: req.get("Origin"),
    });
  }

  // Handle path-to-regexp errors
  if (err.message.includes("Missing parameter name")) {
    return res.status(500).json({
      message:
        "Route configuration error. Please check your route definitions.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
