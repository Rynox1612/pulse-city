const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ROLES } = require("../config/appConstants");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    bloodGroup: { type: String, trim: true },
    allergies: [{ type: String, trim: true }],
    chronicDiseases: [{ type: String, trim: true }],
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relation: { type: String, trim: true },
    },
    location: {
      city: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    // Relationship to Hospitals Model
    savedHospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }],
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  },
  { timestamps: true },
);

// Password Hashing Middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password Verification Helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index email for scalable login queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
