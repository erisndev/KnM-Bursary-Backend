const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const Admin = require("../models/admin.model");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token || token === "null") {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    // Try to find user in User collection
    let user = await User.findById(decoded.userId || decoded.id);
    let isAdmin = false;

    // If not found, try Admin collection
    if (!user) {
      user = await Admin.findById(decoded.userId || decoded.id);
      isAdmin = !!user;
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = {
      id: user._id,
      userId: user._id,
      email: user.email,
      name: user.name,
      isAdmin,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};
module.exports = {
  authenticate,
};
