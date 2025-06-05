const express = require("express");
const router = express.Router();
const {
  createApplication,
  updateApplicationDocuments,
  getAllApplications,
  getApplicationById,
  getApplicationByUserId,
  getUnnotifiedApplications,
  markAsNotified,
  updateApplicationStep,
  updateApplicationStatus,
  addAdminNote,
  getApplicationStats,
  getAdminNotes,
  updateAdminNote,
  deleteAdminNote,
} = require("../controllers/applicant.controller");

// Make sure you have the uploads directory
const fs = require("fs");
const path = require("path");
const { authenticate } = require("../auth/middleware");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post("/create", authenticate, createApplication);
router.get("/", getAllApplications);
router.get("/stats", getApplicationStats);
router.get("/unnotified", getUnnotifiedApplications);
router.get("/user/:userId", getApplicationByUserId);
router.get("/:id", getApplicationById);

router.put("/:id/documents", authenticate, updateApplicationDocuments);

router.put("/:id/notify", markAsNotified);
router.put("/:id/step", authenticate, updateApplicationStep);
router.put("/:id/status", authenticate, updateApplicationStatus);
router.post("/:id/notes", authenticate, addAdminNote);
router.get("/:id/notes", authenticate, getAdminNotes);
router.put("/:id/notes/:noteId", authenticate, updateAdminNote);
router.delete("/:id/notes/:noteId", authenticate, deleteAdminNote);

module.exports = router;
