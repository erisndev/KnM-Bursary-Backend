const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary/cloudinary.js");

// Setup Cloudinary storage with multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on file mimetype
    const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";

    return {
      folder: "applications",
      // Remove format specification to preserve original format
      // format: "jpg", // ❌ This was forcing conversion to JPG
      resource_type: resourceType, // ✅ Dynamic resource type based on file
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// Multer instance with file size limit and file type filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, and PNG files are allowed."
        )
      );
    }
  },
});

// Dynamic additional documents fields
const additionalDocsCount = 5;
const additionalDocFields = Array.from(
  { length: additionalDocsCount },
  (_, i) => ({
    name: `additionalDoc${i}`,
    maxCount: 1,
  })
);

// Fields accepted by multer for upload
const uploadMiddleware = upload.fields([
  { name: "transcript", maxCount: 1 },
  { name: "nationalIdCard", maxCount: 1 },
  { name: "proofOfResidence", maxCount: 1 },
  { name: "letterOfRecommendation", maxCount: 1 },
  { name: "proofOfBankAccount", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
  { name: "payslip", maxCount: 1 },
  ...additionalDocFields,
]);

const uploadMiddlewareWithErrorHandling = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = uploadMiddlewareWithErrorHandling;
