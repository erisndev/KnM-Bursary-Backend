const User = require("../models/user.model.js");
const Applicant = require("../models/applicant.model.js");
const {
  extractDocumentPaths,
  updateDocumentPaths,
} = require("../cloudinary/fileHandler.js");

const createApplication = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required." });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ error: "User not found." });

    const existingApplication = await Applicant.findOne({ userId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You have already submitted an application." });
    }

    let subjects = [],
      previousEducations = [];
    try {
      if (req.body.subjects) subjects = JSON.parse(req.body.subjects);
      if (req.body.previousEducations)
        previousEducations = JSON.parse(req.body.previousEducations);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid JSON format in form fields." });
    }

    // ✅ Handle file uploads
    const documents = extractDocumentPaths(req.files);

    const applicationData = {
      userId,
      ...req.body,
      subjects,
      previousEducations,
      documents,
      currentStep: 1,
      numberOfMembers: parseInt(req.body.numberOfMembers) || 0,
      parent1MonthlyIncome:
        parseFloat(req.body.parent1MonthlyIncome) || undefined,
      parent2MonthlyIncome:
        parseFloat(req.body.parent2MonthlyIncome) || undefined,
    };

    const application = new Applicant(applicationData);

    application.stepHistory.push({
      step: 1,
      stepTitle: "Application Submitted",
      timestamp: new Date(),
      notes: "Initial application submission",
    });

    application.statusHistory.push({
      status: "pending",
      timestamp: new Date(),
      notes: "Application submitted and pending review",
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully.",
      application: {
        id: application._id,
        status: application.status,
        currentStep: application.currentStep,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate application detected." });
    }
    res.status(500).json({ error: "Server error" });
  }
};

const getAllApplications = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    step = "",
  } = req.query;

  // Build query object
  const query = {
    $or: [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };

  // Add status filter if provided
  if (status && status !== "all") {
    query.status = status;
  }

  // Add step filter if provided
  if (step && step !== "all") {
    query.currentStep = parseInt(step);
  }

  try {
    const total = await Applicant.countDocuments(query);
    const applications = await Applicant.find(query)
      .populate("userId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ applications, total });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Applicant.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
};

const getApplicationByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const application = await Applicant.findOne({ userId: userId });

    if (!application) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUnnotifiedApplications = async (req, res) => {
  try {
    const newApps = await Applicant.find({ isNotified: false }).populate(
      "userId",
      "name email"
    );
    res.json(newApps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark application as notified
const markAsNotified = async (req, res) => {
  try {
    const app = await Applicant.findByIdAndUpdate(req.params.id, {
      isNotified: true,
    });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update application step
const updateApplicationStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { step, notes = "" } = req.body;

    // Validate step
    if (!step || step < 1 || step > 7) {
      return res
        .status(400)
        .json({ error: "Invalid step number. Must be between 1 and 7." });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Use the model method to update step with proper tracking
    await application.updateStep(step, notes);

    // Return updated application with populated fields
    const updatedApplication = await Applicant.findById(id);

    res.json({
      message: "Application step updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application step:", error);
    res.status(500).json({ error: "Failed to update application step" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes = "" } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "under_review",
      "approved",
      "rejected",
      "waitlisted",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Use the model method to update status with proper tracking
    await application.updateStatus(status, notes);

    // Fetch the updated application
    const updatedApplication = await Applicant.findById(id);

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

// Add admin note
const addAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!note || note.trim().length === 0) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Use the model method to add admin note
    await application.addAdminNote(note.trim(), createdBy);

    // Return updated application with populated admin notes
    const updatedApplication = await Applicant.findById(id).populate(
      "adminNotes.createdBy",
      "name email"
    );

    res.json({
      message: "Admin note added successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error adding admin note:", error);
    res.status(500).json({ error: "Failed to add admin note" });
  }
};

// Get application statistics
const getApplicationStats = async (req, res) => {
  try {
    const stats = await Applicant.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          under_review: {
            $sum: { $cond: [{ $eq: ["$status", "under_review"] }, 1, 0] },
          },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          waitlisted: {
            $sum: { $cond: [{ $eq: ["$status", "waitlisted"] }, 1, 0] },
          },
        },
      },
    ]);

    const stepStats = await Applicant.aggregate([
      {
        $group: {
          _id: "$currentStep",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      statusStats: stats[0] || {
        total: 0,
        pending: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        waitlisted: 0,
      },
      stepStats: stepStats,
    });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    res.status(500).json({ error: "Failed to fetch application statistics" });
  }
};

const updateApplicationDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (application.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this application." });
    }

    if (["approved", "rejected"].includes(application.status)) {
      return res.status(400).json({
        error: "Cannot update documents for approved or rejected applications.",
      });
    }

    // ✅ Use helper function to update documents
    const updatedDocuments = updateDocumentPaths(
      application.documents,
      req.files
    );

    application.documents = updatedDocuments;
    application.lastModified = new Date();

    if (req.files && Object.keys(req.files).length > 0) {
      application.stepHistory.push({
        step: application.currentStep,
        stepTitle: "Documents Updated",
        timestamp: new Date(),
        notes: "Supporting documents were updated by the applicant",
      });
    }

    await application.save();

    res.status(200).json({
      message: "Documents updated successfully.",
      application: {
        id: application._id,
        documents: application.documents,
        lastModified: application.lastModified,
      },
    });
  } catch (error) {
    console.error("Error updating application documents:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      error: "Failed to update documents.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAdminNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Applicant.findById(id)
      .populate("adminNotes.createdBy", "name email role")
      .select("adminNotes");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      adminNotes: application.adminNotes || [],
    });
  } catch (error) {
    console.error("Error fetching admin notes:", error);
    res.status(500).json({ error: "Failed to fetch admin notes" });
  }
};

// Update admin note
const updateAdminNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;
    const { note } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!note || note.trim().length === 0) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const adminNote = application.adminNotes.id(noteId);
    if (!adminNote) {
      return res.status(404).json({ error: "Admin note not found" });
    }

    // Check if user is the creator of the note or has admin privileges
    if (adminNote.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this note" });
    }

    adminNote.note = note.trim();
    adminNote.lastModified = new Date();
    adminNote.isEdited = true;

    await application.save();

    // Return updated application with populated admin notes
    const updatedApplication = await Applicant.findById(id).populate(
      "adminNotes.createdBy",
      "name email role"
    );

    res.json({
      message: "Admin note updated successfully",
      adminNotes: updatedApplication.adminNotes,
    });
  } catch (error) {
    console.error("Error updating admin note:", error);
    res.status(500).json({ error: "Failed to update admin note" });
  }
};

// Delete admin note
const deleteAdminNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const application = await Applicant.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const adminNote = application.adminNotes.id(noteId);
    if (!adminNote) {
      return res.status(404).json({ error: "Admin note not found" });
    }

    // Check if user is the creator of the note or has admin privileges
    if (adminNote.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this note" });
    }

    // Remove the note
    application.adminNotes.pull(noteId);
    await application.save();

    // Return updated application with populated admin notes
    const updatedApplication = await Applicant.findById(id).populate(
      "adminNotes.createdBy",
      "name email role"
    );

    res.json({
      message: "Admin note deleted successfully",
      adminNotes: updatedApplication.adminNotes,
    });
  } catch (error) {
    console.error("Error deleting admin note:", error);
    res.status(500).json({ error: "Failed to delete admin note" });
  }
};

// Export the new functions along with existing ones
module.exports = {
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
};
