// const mongoose = require("mongoose");

// const applicantSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true,
//   },

//   // Personal Information
//   fullName: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   dob: { type: Date, required: true },
//   gender: { type: String, required: true },
//   nationality: { type: String, required: true },
//   country: { type: String, required: true },
//   address1: { type: String, required: true },
//   address2: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },

//   // Education Information
//   highSchoolName: { type: String, required: true },
//   highSchoolMatricYear: { type: String, required: true },
//   currentEducationLevel: { type: String, required: true },

//   // Subjects and Grades
//   subjects: [
//     {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 2,
//         maxlength: 100,
//       },
//       grade: {
//         type: Number,
//         required: true,
//         min: 0,
//         max: 100,
//       },
//     },
//   ],

//   // Higher Education Information
//   institutionName: { type: String },
//   institutionDegreeType: { type: String },
//   institutionDegreeName: { type: String },
//   institutionMajor: { type: String },
//   institutionStartYear: { type: String },
//   institutionEndYear: { type: String },
//   institutionGPA: { type: String },

//   // Previous Education Entries
//   previousEducations: [
//     {
//       institutionName: { type: String },
//       institutionDegreeType: { type: String },
//       institutionDegreeName: { type: String },
//       institutionMajor: { type: String },
//       institutionStartYear: { type: String },
//       institutionEndYear: { type: String },
//       institutionGPA: { type: String },
//     },
//   ],

//   // Household Information
//   numberOfMembers: { type: Number, required: true },

//   // Parent 1
//   parent1FirstName: { type: String, required: true },
//   parent1LastName: { type: String, required: true },
//   parent1Gender: { type: String, required: true },
//   parent1Relationship: { type: String, required: true },
//   parent1EmploymentStatus: { type: String, required: true },
//   parent1Occupation: { type: String },
//   parent1MonthlyIncome: { type: Number },
//   parent1OtherIncome: { type: Number },

//   // Parent 2 (Optional)
//   parent2FirstName: { type: String },
//   parent2LastName: { type: String },
//   parent2Gender: { type: String },
//   parent2Relationship: { type: String },
//   parent2EmploymentStatus: { type: String },
//   parent2Occupation: { type: String },
//   parent2MonthlyIncome: { type: Number },
//   parent2OtherIncome: { type: Number },

//   // Documents
//   documents: {
//     transcript: { type: String },
//     nationalIdCard: { type: String },
//     proofOfResidence: { type: String },
//     letterOfRecommendation: { type: String },
//     resume: { type: String },
//     coverLetter: { type: String },
//     payslip: { type: String },
//     additionalDocs: [{ type: String }],
//   },

//   // Application Status
//   status: {
//     type: String,
//     enum: ["pending", "under_review", "approved", "rejected", "waitlisted"],
//     default: "pending",
//   },
//   isNotified: {
//     type: Boolean,
//     default: false,
//   },

//   // Metadata
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Automatically update `updatedAt` on save
// applicantSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model("Applicant", applicantSchema);
const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  // Personal Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  country: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },

  // Education Information
  highSchoolName: { type: String, required: true },
  highSchoolMatricYear: { type: String, required: true },
  currentEducationLevel: { type: String, required: true },

  // Subjects and Grades
  subjects: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      grade: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  ],

  // Higher Education Information
  institutionName: { type: String },
  institutionDegreeType: { type: String },
  institutionDegreeName: { type: String },
  institutionMajor: { type: String },
  institutionStartYear: { type: String },
  institutionEndYear: { type: String },
  institutionGPA: { type: String },

  // Previous Education Entries
  previousEducations: [
    {
      institutionName: { type: String },
      institutionDegreeType: { type: String },
      institutionDegreeName: { type: String },
      institutionMajor: { type: String },
      institutionStartYear: { type: String },
      institutionEndYear: { type: String },
      institutionGPA: { type: String },
    },
  ],

  // Household Information
  numberOfMembers: { type: Number, required: true },

  // Parent 1
  parent1FirstName: { type: String, required: true },
  parent1LastName: { type: String, required: true },
  parent1Gender: { type: String, required: true },
  parent1Relationship: { type: String, required: true },
  parent1EmploymentStatus: { type: String, required: true },
  parent1Occupation: { type: String },
  parent1MonthlyIncome: { type: Number },

  // Parent 2 (Optional)
  parent2FirstName: { type: String },
  parent2LastName: { type: String },
  parent2Gender: { type: String },
  parent2Relationship: { type: String },
  parent2EmploymentStatus: { type: String },
  parent2Occupation: { type: String },
  parent2MonthlyIncome: { type: Number },

  // Documents
  documents: {
    transcript: { type: String },
    nationalIdCard: { type: String },
    proofOfResidence: { type: String },
    letterOfRecommendation: { type: String },
    resume: { type: String },
    coverLetter: { type: String },
    payslip: { type: String },
    additionalDocs: [{ type: String }],
  },

  // Application Status
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "waitlisted"],
    default: "pending",
  },

  // Application Progress Tracking
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 7,
  },

  // Step History for tracking progress changes
  stepHistory: [
    {
      step: {
        type: Number,
        required: true,
      },
      stepTitle: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },

      notes: {
        type: String,
        maxlength: 500,
      },
    },
  ],

  // Status History for tracking status changes
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["pending", "under_review", "approved", "rejected", "waitlisted"],
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },

      notes: {
        type: String,
        maxlength: 500,
      },
    },
  ],

  // Admin Notes
  adminNotes: [
    {
      note: {
        type: String,
        required: true,
        maxlength: 1000,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      lastModified: {
        type: Date,
      },
      isEdited: {
        type: Boolean,
        default: false,
      },
    },
  ],

  isNotified: {
    type: Boolean,
    default: false,
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to track changes
applicantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Track status changes
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }

  // Track step changes
  if (this.isModified("currentStep") && !this.isNew) {
    // Get step title from predefined steps
    const stepTitles = [
      "Application Submitted",
      "Document Verification",
      "Academic Review",
      "Financial Assessment",
      "Committee Review",
      "Decision Notification",
      "Fund Disbursement",
    ];

    this.stepHistory.push({
      step: this.currentStep,
      stepTitle: stepTitles[this.currentStep - 1] || `Step ${this.currentStep}`,
      timestamp: new Date(),
    });
  }

  next();
});

// Method to update step with proper tracking
applicantSchema.methods.updateStep = function (newStep, notes = "") {
  const stepTitles = [
    "Application Submitted",
    "Document Verification",
    "Academic Review",
    "Financial Assessment",
    "Committee Review",
    "Decision Notification",
    "Fund Disbursement",
  ];

  this.currentStep = newStep;
  this.stepHistory.push({
    step: newStep,
    stepTitle: stepTitles[newStep - 1] || `Step ${newStep}`,
    timestamp: new Date(),
    notes: notes,
  });

  return this.save();
};

// Method to update status with proper tracking
applicantSchema.methods.updateStatus = function (newStatus, notes = "") {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes,
  });

  return this.save();
};

// Method to add admin note
applicantSchema.methods.addAdminNote = function (note, createdBy) {
  this.adminNotes.push({
    note: note,
    createdBy: createdBy,
    createdAt: new Date(),
  });

  return this.save();
};

module.exports = mongoose.model("Applicant", applicantSchema);
