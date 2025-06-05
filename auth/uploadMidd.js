const multer = require("multer");
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
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

const additionalDocsCount = 5;
const additionalDocFields = Array.from(
  { length: additionalDocsCount },
  (_, i) => ({
    name: `additionalDoc${i}`,
    maxCount: 1,
  })
);

const uploadMiddleware = upload.fields([
  { name: "transcript", maxCount: 1 },
  { name: "nationalIdCard", maxCount: 1 },
  { name: "proofOfResidence", maxCount: 1 },
  { name: "letterOfRecommendation", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
  { name: "payslip", maxCount: 1 },
  ...additionalDocFields,
]);

module.exports = uploadMiddleware;
