const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  resource_type: "auto",
});

// ✅ Debug function to test configuration
const testCloudinaryConfig = () => {
  console.log("=== Cloudinary Configuration Debug ===");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log(
    "API Key:",
    process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "API Secret:",
    process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
  );

  // Test the configuration
  cloudinary.api
    .ping()
    .then((result) => {
      console.log("✅ Cloudinary connection successful:", result);
    })
    .catch((error) => {
      console.error("❌ Cloudinary connection failed:", error);
    });
};

// Call this function to test your configuration
testCloudinaryConfig();

console.log("Cloudinary configured successfully");
module.exports = cloudinary;
