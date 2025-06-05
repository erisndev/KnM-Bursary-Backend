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
// const cloudinary = require("./cloudinary/cloudinary.js");

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, process.env.Sec_FRONTEND_URL];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/applications", bursaryRoutes);
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
