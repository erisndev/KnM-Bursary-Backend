const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/admin.model");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = new Admin({
    email: "admin@knm.com",
    password: "admin123",
  });

  await admin.save();
  console.log("✅ Admin created with password 'admin123'");
  await mongoose.disconnect();
}

createAdmin();
