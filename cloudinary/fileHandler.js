const cloudinary = require("./cloudinary");

// ✅ Helper Function to Extract File Paths
function extractDocumentPaths(files) {
  const documentFields = [
    "transcript",
    "nationalIdCard",
    "proofOfResidence",
    "letterOfRecommendation",
    "proofOfBankAccount",
    "coverLetter",
    "payslip",
  ];
  const documents = {};
  if (files) {
    documentFields.forEach((field) => {
      if (files[field]?.[0]) {
        const file = files[field][0];
        documents[field] = file.path || file.filename || file.url;
      }
    });
    const additionalDocs = [];
    for (let i = 0; i < 5; i++) {
      const field = `additionalDoc${i}`;
      if (files[field]?.[0]) {
        const file = files[field][0];
        additionalDocs.push(file.path || file.filename || file.url);
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
    "proofOfBankAccount",
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

// ✅ Improved delete function that handles both resource types
async function deleteFileIfExists(publicIdOrUrl) {
  if (!publicIdOrUrl) return;

  // Extract public_id from URL
  const parts = publicIdOrUrl.split("/");
  const fileName = parts[parts.length - 1];
  const [publicId] = fileName.split(".");
  const fullPublicId = `applications/${publicId}`;

  try {
    // Try deleting as raw resource first (for PDFs)
    await cloudinary.uploader.destroy(fullPublicId, { resource_type: "raw" });
    console.log(`Successfully deleted raw resource: ${fullPublicId}`);
  } catch (rawError) {
    try {
      // If raw deletion fails, try as image resource
      await cloudinary.uploader.destroy(fullPublicId, {
        resource_type: "image",
      });
      console.log(`Successfully deleted image resource: ${fullPublicId}`);
    } catch (imageError) {
      console.warn(
        `Failed to delete Cloudinary file ${fullPublicId}:`,
        imageError.message
      );
    }
  }
}

module.exports = {
  extractDocumentPaths,
  updateDocumentPaths,
  deleteFileIfExists,
};
