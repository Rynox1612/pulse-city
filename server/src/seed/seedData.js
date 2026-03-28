/**
 * Pulse City — Seed Script
 * Run: npm run seed (from /server)
 *
 * Inserts demo data for hospitals, doctors, users, admin, and emergency requests.
 * Safe to re-run: clears existing seed data before inserting.
 */

require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const HospitalAdmin = require("../models/HospitalAdmin");
const EmergencyRequest = require("../models/EmergencyRequest");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/pulse-city";

// ─── Hospitals ────────────────────────────────────────────────────────────────

const hospitalData = [
  {
    name: "Lilavati Hospital & Research Centre",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 19.0504, lng: 72.8299 },
    specialties: ["Cardiology", "Neurology", "Oncology", "Orthopaedics"],
    emergencyAvailable: true,
    erBeds: 18,
    icuBeds: 24,
    generalBeds: 120,
    ventilators: 15,
    ambulanceAvailable: true,
    contactNumber: "022-26751000",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Kokilaben Dhirubhai Ambani Hospital",
    address:
      "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 19.1276, lng: 72.8382 },
    specialties: ["Cardiology", "Transplant", "Cancer Care", "Robotic Surgery"],
    emergencyAvailable: true,
    erBeds: 22,
    icuBeds: 36,
    generalBeds: 150,
    ventilators: 20,
    ambulanceAvailable: true,
    contactNumber: "022-30999999",
    is24x7: true,
    hospitalType: "specialty",
  },
  {
    name: "Hinduja Hospital",
    address: "Veer Savarkar Marg, Mahim, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 19.0375, lng: 72.8414 },
    specialties: ["Gastroenterology", "Nephrology", "Neurology", "Gynaecology"],
    emergencyAvailable: true,
    erBeds: 14,
    icuBeds: 20,
    generalBeds: 100,
    ventilators: 12,
    ambulanceAvailable: true,
    contactNumber: "022-24452222",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Nanavati Max Super Speciality Hospital",
    address: "SV Road, Vile Parle West, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 19.1002, lng: 72.8387 },
    specialties: [
      "Orthopaedics",
      "Spine Surgery",
      "Cardiology",
      "Neurosciences",
    ],
    emergencyAvailable: true,
    erBeds: 16,
    icuBeds: 28,
    generalBeds: 130,
    ventilators: 14,
    ambulanceAvailable: true,
    contactNumber: "022-26106000",
    is24x7: true,
    hospitalType: "specialty",
  },
  {
    name: "Breach Candy Hospital",
    address: "60-A, Bhulabhai Desai Road, Breach Candy, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 18.9718, lng: 72.8079 },
    specialties: ["Internal Medicine", "Dermatology", "Paediatrics", "ENT"],
    emergencyAvailable: false,
    erBeds: 6,
    icuBeds: 10,
    generalBeds: 80,
    ventilators: 6,
    ambulanceAvailable: false,
    contactNumber: "022-23640888",
    is24x7: false,
    hospitalType: "general",
  },
  {
    name: "Wockhardt Hospital",
    address: "1877, Dr Anandrao Nair Road, Mumbai Central, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 18.969, lng: 72.8224 },
    specialties: ["Cardiac Sciences", "Bariatric Surgery", "Diabetology"],
    emergencyAvailable: true,
    erBeds: 12,
    icuBeds: 18,
    generalBeds: 90,
    ventilators: 10,
    ambulanceAvailable: true,
    contactNumber: "022-61784444",
    is24x7: true,
    hospitalType: "specialty",
  },
  {
    name: "Jupiter Hospital",
    address: "Eastern Express Highway, Thane West, Mumbai",
    city: "Mumbai",
    coordinates: { lat: 19.212, lng: 72.9769 },
    specialties: [
      "Cardiac Surgery",
      "Neurosurgery",
      "Oncology",
      "Orthopaedics",
    ],
    emergencyAvailable: true,
    erBeds: 20,
    icuBeds: 30,
    generalBeds: 110,
    ventilators: 18,
    ambulanceAvailable: true,
    contactNumber: "022-21825555",
    is24x7: true,
    hospitalType: "trauma_center",
  },
];

// ─── Doctor factory (assigned after hospitals are created) ─────────────────────

function buildDoctors(hospitals) {
  const [lilavati, kokilaben, hinduja, nanavati, , wockhardt, jupiter] =
    hospitals;

  return [
    {
      name: "Dr. Rajan Mehta",
      specialization: "Cardiology",
      hospitalId: lilavati._id,
      availabilityStatus: "available",
      shiftStart: "08:00 AM",
      shiftEnd: "04:00 PM",
      contactInfo: { phone: "9876543210", email: "rajan.mehta@lilavati.com" },
    },
    {
      name: "Dr. Priya Sharma",
      specialization: "Neurology",
      hospitalId: lilavati._id,
      availabilityStatus: "in_surgery",
      shiftStart: "10:00 AM",
      shiftEnd: "06:00 PM",
      contactInfo: { phone: "9876543211", email: "priya.sharma@lilavati.com" },
    },
    {
      name: "Dr. Anil Desai",
      specialization: "Oncology",
      hospitalId: kokilaben._id,
      availabilityStatus: "available",
      shiftStart: "09:00 AM",
      shiftEnd: "05:00 PM",
      contactInfo: { phone: "9876543212", email: "anil.desai@kokilaben.com" },
    },
    {
      name: "Dr. Sunita Kapoor",
      specialization: "Transplant Surgery",
      hospitalId: kokilaben._id,
      availabilityStatus: "off_duty",
      shiftStart: "07:00 AM",
      shiftEnd: "03:00 PM",
      contactInfo: {
        phone: "9876543213",
        email: "sunita.kapoor@kokilaben.com",
      },
    },
    {
      name: "Dr. Vikram Nair",
      specialization: "Gastroenterology",
      hospitalId: hinduja._id,
      availabilityStatus: "available",
      shiftStart: "11:00 AM",
      shiftEnd: "07:00 PM",
      contactInfo: { phone: "9876543214", email: "vikram.nair@hinduja.com" },
    },
    {
      name: "Dr. Meena Rao",
      specialization: "Nephrology",
      hospitalId: hinduja._id,
      availabilityStatus: "available",
      shiftStart: "09:00 AM",
      shiftEnd: "05:00 PM",
      contactInfo: { phone: "9876543215", email: "meena.rao@hinduja.com" },
    },
    {
      name: "Dr. Sameer Joshi",
      specialization: "Orthopaedics",
      hospitalId: nanavati._id,
      availabilityStatus: "in_surgery",
      shiftStart: "08:00 AM",
      shiftEnd: "04:00 PM",
      contactInfo: { phone: "9876543216", email: "sameer.joshi@nanavati.com" },
    },
    {
      name: "Dr. Kavita Iyer",
      specialization: "Spine Surgery",
      hospitalId: nanavati._id,
      availabilityStatus: "available",
      shiftStart: "10:00 AM",
      shiftEnd: "06:00 PM",
      contactInfo: { phone: "9876543217", email: "kavita.iyer@nanavati.com" },
    },
    {
      name: "Dr. Rohan Patel",
      specialization: "Cardiac Sciences",
      hospitalId: wockhardt._id,
      availabilityStatus: "available",
      shiftStart: "09:00 AM",
      shiftEnd: "05:00 PM",
      contactInfo: { phone: "9876543218", email: "rohan.patel@wockhardt.com" },
    },
    {
      name: "Dr. Deepa Kulkarni",
      specialization: "Bariatric Surgery",
      hospitalId: wockhardt._id,
      availabilityStatus: "off_duty",
      shiftStart: "07:00 AM",
      shiftEnd: "03:00 PM",
      contactInfo: {
        phone: "9876543219",
        email: "deepa.kulkarni@wockhardt.com",
      },
    },
    {
      name: "Dr. Arjun Singh",
      specialization: "Cardiac Surgery",
      hospitalId: jupiter._id,
      availabilityStatus: "available",
      shiftStart: "08:00 AM",
      shiftEnd: "08:00 PM",
      contactInfo: { phone: "9876543220", email: "arjun.singh@jupiter.com" },
    },
    {
      name: "Dr. Nalini Bose",
      specialization: "Neurosurgery",
      hospitalId: jupiter._id,
      availabilityStatus: "available",
      shiftStart: "12:00 PM",
      shiftEnd: "08:00 PM",
      contactInfo: { phone: "9876543221", email: "nalini.bose@jupiter.com" },
    },
  ];
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected.\n");

  // ── Clear existing seed data ──────────────────────────────────────────────
  console.log("🧹 Clearing existing data...");
  await Promise.all([
    Hospital.deleteMany({}),
    Doctor.deleteMany({}),
    EmergencyRequest.deleteMany({}),
    User.deleteMany({ email: "user@pulse.com" }),
    HospitalAdmin.deleteMany({ email: "admin@pulse.com" }),
  ]);
  console.log("✅ Cleared.\n");

  // ── Insert Hospitals ──────────────────────────────────────────────────────
  console.log("🏥 Inserting hospitals...");
  const hospitals = await Hospital.insertMany(hospitalData);
  console.log(`✅ ${hospitals.length} hospitals inserted.\n`);

  // ── Insert Doctors ────────────────────────────────────────────────────────
  console.log("👨‍⚕️ Inserting doctors...");
  const doctors = await Doctor.insertMany(buildDoctors(hospitals));
  console.log(`✅ ${doctors.length} doctors inserted.\n`);

  // ── Insert Demo User ──────────────────────────────────────────────────────
  console.log("👤 Inserting demo user...");
  const demoUser = await User.create({
    name: "Aarav Shah",
    email: "user@pulse.com",
    password: "123456", // hashed by pre-save hook
    phone: "9000000001",
    age: 28,
    gender: "male",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Dust"],
    chronicDiseases: ["Asthma"],
    emergencyContact: {
      name: "Rekha Shah",
      phone: "9000000002",
      relation: "Mother",
    },
    location: {
      city: "Mumbai",
      coordinates: { lat: 19.076, lng: 72.8777 },
    },
    role: "user",
  });
  console.log(`✅ Demo user created: ${demoUser.email}\n`);

  // ── Insert Demo Admin ─────────────────────────────────────────────────────
  console.log("🛡️ Inserting demo admin...");
  const linkedHospital = hospitals[0]; // Lilavati
  const demoAdmin = await HospitalAdmin.create({
    name: "Admin Kulkarni",
    email: "admin@pulse.com",
    password: "123456", // hashed by pre-save hook
    hospitalId: linkedHospital._id,
    role: "hospital_admin",
  });
  console.log(
    `✅ Demo admin created: ${demoAdmin.email} → linked to "${linkedHospital.name}"\n`,
  );

  // ── Insert Emergency Requests ─────────────────────────────────────────────
  console.log("🚨 Inserting emergency requests...");
  const emergencyData = [
    {
      userId: demoUser._id,
      hospitalId: hospitals[0]._id,
      symptoms: ["chest pain", "shortness of breath"],
      severity: "critical",
      status: "completed",
      liveLocation: {
        lat: 19.054,
        lng: 72.832,
        addressStr: "Near Bandra Station, Mumbai",
      },
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      userId: demoUser._id,
      hospitalId: hospitals[1]._id,
      symptoms: ["high fever", "confusion", "neck stiffness"],
      severity: "high",
      status: "accepted",
      liveLocation: {
        lat: 19.128,
        lng: 72.839,
        addressStr: "Andheri West, Mumbai",
      },
      requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      userId: demoUser._id,
      hospitalId: hospitals[2]._id,
      symptoms: ["severe abdominal pain", "vomiting"],
      severity: "medium",
      status: "pending",
      liveLocation: {
        lat: 19.038,
        lng: 72.842,
        addressStr: "Mahim, Mumbai",
      },
      requestedAt: new Date(),
    },
    {
      userId: demoUser._id,
      hospitalId: hospitals[6]._id,
      symptoms: ["road accident", "head injury", "unconscious"],
      severity: "critical",
      status: "in_progress",
      liveLocation: {
        lat: 19.213,
        lng: 72.978,
        addressStr: "Eastern Express Highway, Thane",
      },
      requestedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    },
  ];

  const requests = await EmergencyRequest.insertMany(emergencyData);
  console.log(`✅ ${requests.length} emergency requests inserted.\n`);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log("─────────────────────────────────────────");
  console.log("🎉 Seed complete!");
  console.log("");
  console.log("  Demo User  → user@pulse.com   / 123456");
  console.log("  Demo Admin → admin@pulse.com  / 123456");
  console.log(`  Admin linked to: ${linkedHospital.name}`);
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
