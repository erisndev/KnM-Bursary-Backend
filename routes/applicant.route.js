// applicant.route.js
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
const uploadMiddleware = require("../auth/uploadMidd");
const authenticate = require("../auth/middleware");

// Routes
router.post("/create", authenticate, uploadMiddleware, createApplication);
router.get("/", getAllApplications);
router.get("/stats", getApplicationStats);
router.get("/unnotified", getUnnotifiedApplications);
router.get("/user/:userId", getApplicationByUserId);
router.get("/:id", getApplicationById);
router.put(
  "/:id/documents",
  authenticate,
  uploadMiddleware,
  updateApplicationDocuments
);
router.put("/:id/notify", markAsNotified);
router.put("/:id/step", authenticate, updateApplicationStep);
router.put("/:id/status", authenticate, updateApplicationStatus);
router.post("/:id/notes", authenticate, addAdminNote);
router.get("/:id/notes", authenticate, getAdminNotes);
router.put("/:id/notes/:noteId", authenticate, updateAdminNote);
router.delete("/:id/notes/:noteId", authenticate, deleteAdminNote);

module.exports = router;
