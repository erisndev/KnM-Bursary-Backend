const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser"); // Add this line
const userRoutes = require("./routes/user.route.js");
const bursaryRoutes = require("./routes/applicant.route.js");
const adminRoutes = require("./routes/admin.route.js");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, process.env.Sec_FRONTEND_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); // Add this line

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/applications", bursaryRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("KNP Bursary App Backend is running.");
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
