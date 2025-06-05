const fs = require("fs");
const cloudinary = require("./cloudinary");

// ✅ Helper Function to Extract File Paths
function extractDocumentPaths(files) {
  const documentFields = [
    "transcript",
    "nationalIdCard",
    "proofOfResidence",
    "letterOfRecommendation",
    "resume",
    "coverLetter",
    "payslip",
  ];

  const documents = {};

  if (files) {
    // Add known documents
    documentFields.forEach((field) => {
      if (files[field]?.[0]) {
        documents[field] = files[field][0].path;
      }
    });

    // Add additional documents dynamically
    const additionalDocs = [];
    for (let i = 0; i < 5; i++) {
      const field = `additionalDoc${i}`;
      if (files[field]?.[0]) {
        additionalDocs.push(files[field][0].path);
      }
    }
    if (additionalDocs.length > 0) {
      documents.additionalDocs = additionalDocs;
    }
  }

  return documents;
}

function updateDocumentPaths(existingDocs = {}, files = {}) {
  const docTypes = [
    "transcript",
    "nationalIdCard",
    "proofOfResidence",
    "letterOfRecommendation",
    "resume",
    "coverLetter",
    "payslip",
  ];

  const updatedDocs = { ...existingDocs };

  // Replace main documents
  docTypes.forEach((docType) => {
    if (files[docType]?.[0]) {
      const newPath = files[docType][0].path;
      deleteFileIfExists(updatedDocs[docType]);
      updatedDocs[docType] = newPath;
    }
  });

  // Replace additional documents if new ones were uploaded
  const newAdditionalDocs = [];
  for (let i = 0; i < 5; i++) {
    const field = `additionalDoc${i}`;
    if (files[field]?.[0]) {
      newAdditionalDocs.push(files[field][0].path);
    }
  }

  if (newAdditionalDocs.length > 0) {
    if (Array.isArray(updatedDocs.additionalDocs)) {
      updatedDocs.additionalDocs.forEach(deleteFileIfExists);
    }
    updatedDocs.additionalDocs = newAdditionalDocs;
  }

  return updatedDocs;
}

function deleteFileIfExists(publicIdOrUrl) {
  if (!publicIdOrUrl) return;

  // If it's a URL, extract the public_id
  const parts = publicIdOrUrl.split("/");
  const fileName = parts[parts.length - 1];
  const [publicId] = fileName.split(".");

  // Attempt to delete from both raw and image resource types
  cloudinary.uploader
    .destroy(`applications/${publicId}`, { resource_type: "image" })
    .catch(() =>
      cloudinary.uploader.destroy(`applications/${publicId}`, {
        resource_type: "raw",
      })
    )
    .catch((err) =>
      console.warn("Failed to delete Cloudinary file:", err.message)
    );
}

module.exports = {
  extractDocumentPaths,
  updateDocumentPaths,
};
