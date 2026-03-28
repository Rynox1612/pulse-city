/**
 * Pulse City — Seed Script (Expanded)
 * Run: npm run seed (from /server)
 *
 * Inserts demo data for 20 hospitals, doctors, 5 users, 5 admins, and emergency requests.
 * Safe to re-run: clears existing seed data before inserting.
 */

require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");

const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const HospitalAdmin = require("../models/HospitalAdmin");
const EmergencyRequest = require("../models/EmergencyRequest");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/pulse-city";

// ─── Hospitals (20) ───────────────────────────────────────────────────────────

const hospitalData = [
  // ── Mumbai ──
  {
    name: "Lilavati Hospital & Research Centre",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.8299, 19.0504] },
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
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.8382, 19.1276] },
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
    location: { type: "Point", coordinates: [72.8414, 19.0375] },
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
    location: { type: "Point", coordinates: [72.8387, 19.1002] },
    specialties: ["Orthopaedics", "Spine Surgery", "Cardiology", "Neurosciences"],
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
    location: { type: "Point", coordinates: [72.8079, 18.9718] },
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
    location: { type: "Point", coordinates: [72.8224, 18.969] },
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
    location: { type: "Point", coordinates: [72.9769, 19.212] },
    specialties: ["Cardiac Surgery", "Neurosurgery", "Oncology", "Orthopaedics"],
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
  {
    name: "Fortis Hospital Mulund",
    address: "Mulund Goregaon Link Road, Mulund West, Mumbai",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.9565, 19.1725] },
    specialties: ["Renal Sciences", "Liver Transplant", "Haematology", "Cardiology"],
    emergencyAvailable: true,
    erBeds: 15,
    icuBeds: 22,
    generalBeds: 105,
    ventilators: 13,
    ambulanceAvailable: true,
    contactNumber: "022-21822000",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Jaslok Hospital & Research Centre",
    address: "15, Dr G Deshmukh Marg, Pedder Road, Mumbai",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.8076, 18.9688] },
    specialties: ["Neurology", "Haematology", "Rheumatology", "Paediatrics"],
    emergencyAvailable: true,
    erBeds: 10,
    icuBeds: 16,
    generalBeds: 95,
    ventilators: 9,
    ambulanceAvailable: true,
    contactNumber: "022-66573333",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Saifee Hospital",
    address: "15/17, Maharshi Karve Road, Charni Road, Mumbai",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.8194, 18.9541] },
    specialties: ["Minimally Invasive Surgery", "ENT", "Ophthalmology", "Orthopaedics"],
    emergencyAvailable: false,
    erBeds: 5,
    icuBeds: 8,
    generalBeds: 60,
    ventilators: 4,
    ambulanceAvailable: false,
    contactNumber: "022-67570111",
    is24x7: false,
    hospitalType: "general",
  },

  // ── Pune ──
  {
    name: "Ruby Hall Clinic",
    address: "40, Sassoon Road, Pune",
    city: "Pune",
    location: { type: "Point", coordinates: [73.8714, 18.5275] },
    specialties: ["Cardiology", "Oncology", "Neurology", "Nephrology"],
    emergencyAvailable: true,
    erBeds: 18,
    icuBeds: 26,
    generalBeds: 130,
    ventilators: 16,
    ambulanceAvailable: true,
    contactNumber: "020-26163391",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Sahyadri Super Speciality Hospital",
    address: "30, Karve Road, Erandwane, Pune",
    city: "Pune",
    location: { type: "Point", coordinates: [73.8328, 18.5076] },
    specialties: ["Bone Marrow Transplant", "Cardiac Surgery", "Bariatric Surgery"],
    emergencyAvailable: true,
    erBeds: 14,
    icuBeds: 20,
    generalBeds: 100,
    ventilators: 12,
    ambulanceAvailable: true,
    contactNumber: "020-67213000",
    is24x7: true,
    hospitalType: "specialty",
  },
  {
    name: "KEM Hospital Pune",
    address: "Rasta Peth, Pune",
    city: "Pune",
    location: { type: "Point", coordinates: [73.8748, 18.5195] },
    specialties: ["General Surgery", "Internal Medicine", "Gynaecology", "Paediatrics"],
    emergencyAvailable: true,
    erBeds: 20,
    icuBeds: 18,
    generalBeds: 140,
    ventilators: 14,
    ambulanceAvailable: true,
    contactNumber: "020-26128000",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Deenanath Mangeshkar Hospital",
    address: "Erandwane, Pune",
    city: "Pune",
    location: { type: "Point", coordinates: [73.8282, 18.5067] },
    specialties: ["Cardiology", "Neurosurgery", "Orthopaedics", "Urology"],
    emergencyAvailable: true,
    erBeds: 16,
    icuBeds: 24,
    generalBeds: 115,
    ventilators: 15,
    ambulanceAvailable: true,
    contactNumber: "020-49153000",
    is24x7: true,
    hospitalType: "trauma_center",
  },

  // ── Nashik ──
  {
    name: "Wockhardt Hospital Nashik",
    address: "Pathardi Phata, Nashik",
    city: "Nashik",
    location: { type: "Point", coordinates: [73.7902, 20.0112] },
    specialties: ["Cardiology", "Orthopaedics", "General Surgery", "ENT"],
    emergencyAvailable: true,
    erBeds: 10,
    icuBeds: 14,
    generalBeds: 80,
    ventilators: 8,
    ambulanceAvailable: true,
    contactNumber: "0253-6600100",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Apollo Hospitals Nashik",
    address: "New Nashik, Maharashtra",
    city: "Nashik",
    location: { type: "Point", coordinates: [73.7898, 19.9975] },
    specialties: ["Oncology", "Neurology", "Nephrology", "Spine Surgery"],
    emergencyAvailable: true,
    erBeds: 12,
    icuBeds: 18,
    generalBeds: 90,
    ventilators: 10,
    ambulanceAvailable: true,
    contactNumber: "0253-6620000",
    is24x7: true,
    hospitalType: "specialty",
  },

  // ── Nagpur ──
  {
    name: "Alexis Multispeciality Hospital",
    address: "Koradi Road, Nagpur",
    city: "Nagpur",
    location: { type: "Point", coordinates: [79.0626, 21.1975] },
    specialties: ["Cardiac Surgery", "Oncology", "Neurosciences", "Transplant"],
    emergencyAvailable: true,
    erBeds: 16,
    icuBeds: 22,
    generalBeds: 100,
    ventilators: 14,
    ambulanceAvailable: true,
    contactNumber: "0712-6604444",
    is24x7: true,
    hospitalType: "trauma_center",
  },
  {
    name: "Wockhardt Hospital Nagpur",
    address: "South Ambazari Road, Nagpur",
    city: "Nagpur",
    location: { type: "Point", coordinates: [79.0526, 21.1204] },
    specialties: ["Cardiology", "Gastroenterology", "Orthopaedics"],
    emergencyAvailable: true,
    erBeds: 10,
    icuBeds: 12,
    generalBeds: 70,
    ventilators: 8,
    ambulanceAvailable: true,
    contactNumber: "0712-6633000",
    is24x7: true,
    hospitalType: "general",
  },

  // ── Aurangabad ──
  {
    name: "Kamalnayan Bajaj Hospital",
    address: "Gut No. 43, Vaijapur Road, Aurangabad",
    city: "Aurangabad",
    location: { type: "Point", coordinates: [75.3236, 19.896] },
    specialties: ["Cardiology", "Nephrology", "Paediatrics", "Gynaecology"],
    emergencyAvailable: true,
    erBeds: 12,
    icuBeds: 16,
    generalBeds: 90,
    ventilators: 10,
    ambulanceAvailable: true,
    contactNumber: "0240-2452015",
    is24x7: true,
    hospitalType: "general",
  },
  {
    name: "Government Medical College Aurangabad",
    address: "Ghati, Aurangabad",
    city: "Aurangabad",
    location: { type: "Point", coordinates: [75.3433, 19.8651] },
    specialties: ["General Medicine", "Surgery", "Paediatrics", "Psychiatry"],
    emergencyAvailable: true,
    erBeds: 25,
    icuBeds: 20,
    generalBeds: 200,
    ventilators: 20,
    ambulanceAvailable: true,
    contactNumber: "0240-2400505",
    is24x7: true,
    hospitalType: "general",
  },
];

// ─── Doctor factory ────────────────────────────────────────────────────────────

function buildDoctors(hospitals) {
  // Index map for readability
  const [
    lilavati,       // 0
    kokilaben,      // 1
    hinduja,        // 2
    nanavati,       // 3
    ,               // 4 breach candy – skip
    wockhardt,      // 5
    jupiter,        // 6
    fortis,         // 7
    jaslok,         // 8
    ,               // 9 saifee – skip
    ruby,           // 10
    sahyadri,       // 11
    kem,            // 12
    deenanath,      // 13
    wockhardtNashik,// 14
    apolloNashik,   // 15
    alexis,         // 16
    wockhardtNagpur,// 17
    kamalnayan,     // 18
    gmcAurangabad,  // 19
  ] = hospitals;

  return [
    // Lilavati
    { name: "Dr. Rajan Mehta",    specialization: "Cardiology",       hospitalId: lilavati._id,        availabilityStatus: "available",  shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543210", email: "rajan.mehta@lilavati.com" } },
    { name: "Dr. Priya Sharma",   specialization: "Neurology",         hospitalId: lilavati._id,        availabilityStatus: "in_surgery", shiftStart: "10:00 AM", shiftEnd: "06:00 PM", contactInfo: { phone: "9876543211", email: "priya.sharma@lilavati.com" } },
    // Kokilaben
    { name: "Dr. Anil Desai",     specialization: "Oncology",          hospitalId: kokilaben._id,       availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543212", email: "anil.desai@kokilaben.com" } },
    { name: "Dr. Sunita Kapoor",  specialization: "Transplant Surgery",hospitalId: kokilaben._id,       availabilityStatus: "off_duty",   shiftStart: "07:00 AM", shiftEnd: "03:00 PM", contactInfo: { phone: "9876543213", email: "sunita.kapoor@kokilaben.com" } },
    // Hinduja
    { name: "Dr. Vikram Nair",    specialization: "Gastroenterology",  hospitalId: hinduja._id,         availabilityStatus: "available",  shiftStart: "11:00 AM", shiftEnd: "07:00 PM", contactInfo: { phone: "9876543214", email: "vikram.nair@hinduja.com" } },
    { name: "Dr. Meena Rao",      specialization: "Nephrology",        hospitalId: hinduja._id,         availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543215", email: "meena.rao@hinduja.com" } },
    // Nanavati
    { name: "Dr. Sameer Joshi",   specialization: "Orthopaedics",      hospitalId: nanavati._id,        availabilityStatus: "in_surgery", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543216", email: "sameer.joshi@nanavati.com" } },
    { name: "Dr. Kavita Iyer",    specialization: "Spine Surgery",     hospitalId: nanavati._id,        availabilityStatus: "available",  shiftStart: "10:00 AM", shiftEnd: "06:00 PM", contactInfo: { phone: "9876543217", email: "kavita.iyer@nanavati.com" } },
    // Wockhardt Mumbai
    { name: "Dr. Rohan Patel",    specialization: "Cardiac Sciences",  hospitalId: wockhardt._id,       availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543218", email: "rohan.patel@wockhardt.com" } },
    { name: "Dr. Deepa Kulkarni", specialization: "Bariatric Surgery", hospitalId: wockhardt._id,       availabilityStatus: "off_duty",   shiftStart: "07:00 AM", shiftEnd: "03:00 PM", contactInfo: { phone: "9876543219", email: "deepa.kulkarni@wockhardt.com" } },
    // Jupiter
    { name: "Dr. Arjun Singh",    specialization: "Cardiac Surgery",   hospitalId: jupiter._id,         availabilityStatus: "available",  shiftStart: "08:00 AM", shiftEnd: "08:00 PM", contactInfo: { phone: "9876543220", email: "arjun.singh@jupiter.com" } },
    { name: "Dr. Nalini Bose",    specialization: "Neurosurgery",      hospitalId: jupiter._id,         availabilityStatus: "available",  shiftStart: "12:00 PM", shiftEnd: "08:00 PM", contactInfo: { phone: "9876543221", email: "nalini.bose@jupiter.com" } },
    // Fortis Mulund
    { name: "Dr. Harish Gupta",   specialization: "Renal Sciences",    hospitalId: fortis._id,          availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543222", email: "harish.gupta@fortis.com" } },
    { name: "Dr. Sneha Chavan",   specialization: "Haematology",       hospitalId: fortis._id,          availabilityStatus: "in_surgery", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543223", email: "sneha.chavan@fortis.com" } },
    // Jaslok
    { name: "Dr. Imran Sheikh",   specialization: "Rheumatology",      hospitalId: jaslok._id,          availabilityStatus: "available",  shiftStart: "10:00 AM", shiftEnd: "06:00 PM", contactInfo: { phone: "9876543224", email: "imran.sheikh@jaslok.com" } },
    { name: "Dr. Pooja Tiwari",   specialization: "Paediatrics",       hospitalId: jaslok._id,          availabilityStatus: "off_duty",   shiftStart: "07:00 AM", shiftEnd: "03:00 PM", contactInfo: { phone: "9876543225", email: "pooja.tiwari@jaslok.com" } },
    // Ruby Hall Pune
    { name: "Dr. Suresh Patil",   specialization: "Cardiology",        hospitalId: ruby._id,            availabilityStatus: "available",  shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543226", email: "suresh.patil@rubyhall.com" } },
    { name: "Dr. Anita More",     specialization: "Oncology",          hospitalId: ruby._id,            availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543227", email: "anita.more@rubyhall.com" } },
    // Sahyadri Pune
    { name: "Dr. Kiran Jadhav",   specialization: "Bone Marrow Transplant", hospitalId: sahyadri._id,   availabilityStatus: "in_surgery", shiftStart: "08:00 AM", shiftEnd: "08:00 PM", contactInfo: { phone: "9876543228", email: "kiran.jadhav@sahyadri.com" } },
    // KEM Pune
    { name: "Dr. Prasad Deshpande", specialization: "General Surgery", hospitalId: kem._id,            availabilityStatus: "available",  shiftStart: "07:00 AM", shiftEnd: "03:00 PM", contactInfo: { phone: "9876543229", email: "prasad.deshpande@kem.com" } },
    { name: "Dr. Vaishali Kulkarni", specialization: "Gynaecology",    hospitalId: kem._id,            availabilityStatus: "available",  shiftStart: "11:00 AM", shiftEnd: "07:00 PM", contactInfo: { phone: "9876543230", email: "vaishali.kulkarni@kem.com" } },
    // Deenanath Pune
    { name: "Dr. Amit Wagh",      specialization: "Neurosurgery",      hospitalId: deenanath._id,       availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "09:00 PM", contactInfo: { phone: "9876543231", email: "amit.wagh@deenanath.com" } },
    { name: "Dr. Leena Gokhale",  specialization: "Cardiology",        hospitalId: deenanath._id,       availabilityStatus: "off_duty",   shiftStart: "06:00 AM", shiftEnd: "02:00 PM", contactInfo: { phone: "9876543232", email: "leena.gokhale@deenanath.com" } },
    // Wockhardt Nashik
    { name: "Dr. Sandeep Bhosale", specialization: "Cardiology",       hospitalId: wockhardtNashik._id, availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543233", email: "sandeep.bhosale@wockhardt-nashik.com" } },
    // Apollo Nashik
    { name: "Dr. Rujuta Marathe", specialization: "Oncology",          hospitalId: apolloNashik._id,    availabilityStatus: "available",  shiftStart: "10:00 AM", shiftEnd: "06:00 PM", contactInfo: { phone: "9876543234", email: "rujuta.marathe@apollo-nashik.com" } },
    { name: "Dr. Yusuf Ansari",   specialization: "Neurology",         hospitalId: apolloNashik._id,    availabilityStatus: "in_surgery", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543235", email: "yusuf.ansari@apollo-nashik.com" } },
    // Alexis Nagpur
    { name: "Dr. Nikhil Thakur",  specialization: "Cardiac Surgery",   hospitalId: alexis._id,          availabilityStatus: "available",  shiftStart: "08:00 AM", shiftEnd: "08:00 PM", contactInfo: { phone: "9876543236", email: "nikhil.thakur@alexis.com" } },
    { name: "Dr. Shruti Pandey",  specialization: "Oncology",          hospitalId: alexis._id,          availabilityStatus: "available",  shiftStart: "10:00 AM", shiftEnd: "06:00 PM", contactInfo: { phone: "9876543237", email: "shruti.pandey@alexis.com" } },
    // Wockhardt Nagpur
    { name: "Dr. Rajesh Bawane",  specialization: "Gastroenterology",  hospitalId: wockhardtNagpur._id, availabilityStatus: "off_duty",   shiftStart: "07:00 AM", shiftEnd: "03:00 PM", contactInfo: { phone: "9876543238", email: "rajesh.bawane@wockhardt-nagpur.com" } },
    // Kamalnayan Aurangabad
    { name: "Dr. Seema Jain",     specialization: "Nephrology",        hospitalId: kamalnayan._id,       availabilityStatus: "available",  shiftStart: "09:00 AM", shiftEnd: "05:00 PM", contactInfo: { phone: "9876543239", email: "seema.jain@kamalnayan.com" } },
    // GMC Aurangabad
    { name: "Dr. Bhaskar Salve",  specialization: "General Medicine",  hospitalId: gmcAurangabad._id,   availabilityStatus: "available",  shiftStart: "08:00 AM", shiftEnd: "04:00 PM", contactInfo: { phone: "9876543240", email: "bhaskar.salve@gmcaurangabad.com" } },
    { name: "Dr. Madhuri Shinde", specialization: "Psychiatry",        hospitalId: gmcAurangabad._id,   availabilityStatus: "in_surgery", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", contactInfo: { phone: "9876543241", email: "madhuri.shinde@gmcaurangabad.com" } },
  ];
}

// ─── Demo Users (5) ───────────────────────────────────────────────────────────

const usersData = [
  {
    name: "Aarav Shah",
    email: "user1@pulse.com",
    password: "123456",
    phone: "9000000001",
    age: 28,
    gender: "male",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Dust"],
    chronicDiseases: ["Asthma"],
    emergencyContact: { name: "Rekha Shah", phone: "9000000002", relation: "Mother" },
    location: { city: "Mumbai", coordinates: { lat: 19.076, lng: 72.8777 } },
    role: "user",
  },
  {
    name: "Sneha Patil",
    email: "user2@pulse.com",
    password: "123456",
    phone: "9000000003",
    age: 34,
    gender: "female",
    bloodGroup: "O+",
    allergies: ["Sulfa"],
    chronicDiseases: ["Hypertension", "Diabetes"],
    emergencyContact: { name: "Rahul Patil", phone: "9000000004", relation: "Husband" },
    location: { city: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
    role: "user",
  },
  {
    name: "Rohan Desai",
    email: "user3@pulse.com",
    password: "123456",
    phone: "9000000005",
    age: 42,
    gender: "male",
    bloodGroup: "A-",
    allergies: [],
    chronicDiseases: ["Thyroid"],
    emergencyContact: { name: "Sonal Desai", phone: "9000000006", relation: "Wife" },
    location: { city: "Nashik", coordinates: { lat: 19.9975, lng: 73.7898 } },
    role: "user",
  },
  {
    name: "Prachi Kulkarni",
    email: "user4@pulse.com",
    password: "123456",
    phone: "9000000007",
    age: 22,
    gender: "female",
    bloodGroup: "AB+",
    allergies: ["Latex"],
    chronicDiseases: [],
    emergencyContact: { name: "Suhas Kulkarni", phone: "9000000008", relation: "Father" },
    location: { city: "Nagpur", coordinates: { lat: 21.1458, lng: 79.0882 } },
    role: "user",
  },
  {
    name: "Mahesh Joshi",
    email: "user5@pulse.com",
    password: "123456",
    phone: "9000000009",
    age: 55,
    gender: "male",
    bloodGroup: "B-",
    allergies: ["Aspirin"],
    chronicDiseases: ["Coronary Artery Disease"],
    emergencyContact: { name: "Anita Joshi", phone: "9000000010", relation: "Wife" },
    location: { city: "Aurangabad", coordinates: { lat: 19.8762, lng: 75.3433 } },
    role: "user",
  },
];

// ─── Demo Admins (5) — linked to hospitals[0..4] ──────────────────────────────

const adminSeedEmails = [
  "admin1@pulse.com",
  "admin2@pulse.com",
  "admin3@pulse.com",
  "admin4@pulse.com",
  "admin5@pulse.com",
];

function buildAdmins(hospitals) {
  return [
    { name: "Admin Kulkarni",   email: "admin1@pulse.com", password: "123456", hospitalId: hospitals[0]._id,  role: "hospital_admin" }, // Lilavati
    { name: "Admin Mehta",      email: "admin2@pulse.com", password: "123456", hospitalId: hospitals[1]._id,  role: "hospital_admin" }, // Kokilaben
    { name: "Admin Rao",        email: "admin3@pulse.com", password: "123456", hospitalId: hospitals[10]._id, role: "hospital_admin" }, // Ruby Hall Pune
    { name: "Admin Thakur",     email: "admin4@pulse.com", password: "123456", hospitalId: hospitals[16]._id, role: "hospital_admin" }, // Alexis Nagpur
    { name: "Admin Shinde",     email: "admin5@pulse.com", password: "123456", hospitalId: hospitals[19]._id, role: "hospital_admin" }, // GMC Aurangabad
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
    // Clear by email OR phone to avoid duplicate key errors on re-runs / old seeds
    User.deleteMany({
      $or: [
        { email: { $in: usersData.map((u) => u.email) } },
        { phone: { $in: usersData.map((u) => u.phone) } },
        // Legacy seed user
        { email: "user@pulse.com" },
        { phone: "9000000001" },
      ],
    }),
    HospitalAdmin.deleteMany({
      $or: [
        { email: { $in: adminSeedEmails } },
        // Legacy seed admin
        { email: "admin@pulse.com" },
      ],
    }),
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

  // ── Insert Demo Users ─────────────────────────────────────────────────────
  console.log("👤 Inserting demo users...");
  const users = [];
  for (const userData of usersData) {
    const u = await User.create(userData);
    users.push(u);
    console.log(`   ✔ ${u.name} (${u.email})`);
  }
  console.log(`✅ ${users.length} users inserted.\n`);

  // ── Insert Demo Admins ────────────────────────────────────────────────────
  console.log("🛡️ Inserting demo admins...");
  const adminList = buildAdmins(hospitals);
  const admins = [];
  for (const adminData of adminList) {
    const a = await HospitalAdmin.create(adminData);
    const linkedHosp = hospitals.find((h) => h._id.equals(adminData.hospitalId));
    admins.push(a);
    console.log(`   ✔ ${a.name} (${a.email}) → "${linkedHosp?.name}"`);
  }
  console.log(`✅ ${admins.length} admins inserted.\n`);

  // ── Insert Emergency Requests ─────────────────────────────────────────────
  console.log("🚨 Inserting emergency requests...");
  const emergencyData = [
    {
      userId: users[0]._id,
      hospitalId: hospitals[0]._id,
      symptoms: ["chest pain", "shortness of breath"],
      severity: "critical",
      status: "completed",
      liveLocation: { lat: 19.054, lng: 72.832, addressStr: "Near Bandra Station, Mumbai" },
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      userId: users[0]._id,
      hospitalId: hospitals[1]._id,
      symptoms: ["high fever", "confusion", "neck stiffness"],
      severity: "high",
      status: "accepted",
      liveLocation: { lat: 19.128, lng: 72.839, addressStr: "Andheri West, Mumbai" },
      requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      userId: users[1]._id,
      hospitalId: hospitals[10]._id,
      symptoms: ["severe abdominal pain", "vomiting"],
      severity: "medium",
      status: "pending",
      liveLocation: { lat: 18.525, lng: 73.871, addressStr: "Sassoon Road, Pune" },
      requestedAt: new Date(),
    },
    {
      userId: users[1]._id,
      hospitalId: hospitals[13]._id,
      symptoms: ["uncontrolled blood pressure", "severe headache"],
      severity: "high",
      status: "in_progress",
      liveLocation: { lat: 18.506, lng: 73.829, addressStr: "Erandwane, Pune" },
      requestedAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      userId: users[2]._id,
      hospitalId: hospitals[14]._id,
      symptoms: ["difficulty breathing", "chest tightness"],
      severity: "high",
      status: "pending",
      liveLocation: { lat: 20.011, lng: 73.79, addressStr: "Pathardi Phata, Nashik" },
      requestedAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      userId: users[3]._id,
      hospitalId: hospitals[16]._id,
      symptoms: ["road accident", "head injury", "unconscious"],
      severity: "critical",
      status: "in_progress",
      liveLocation: { lat: 21.197, lng: 79.062, addressStr: "Koradi Road, Nagpur" },
      requestedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      userId: users[3]._id,
      hospitalId: hospitals[17]._id,
      symptoms: ["abdominal pain", "blood in stool"],
      severity: "medium",
      status: "completed",
      liveLocation: { lat: 21.12, lng: 79.052, addressStr: "South Ambazari Road, Nagpur" },
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      userId: users[4]._id,
      hospitalId: hospitals[18]._id,
      symptoms: ["heart palpitations", "dizziness", "sweating"],
      severity: "critical",
      status: "accepted",
      liveLocation: { lat: 19.896, lng: 75.323, addressStr: "Vaijapur Road, Aurangabad" },
      requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      userId: users[4]._id,
      hospitalId: hospitals[19]._id,
      symptoms: ["fracture", "severe pain in leg"],
      severity: "medium",
      status: "completed",
      liveLocation: { lat: 19.865, lng: 75.343, addressStr: "Ghati, Aurangabad" },
      requestedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      userId: users[0]._id,
      hospitalId: hospitals[6]._id,
      symptoms: ["seizure", "loss of consciousness"],
      severity: "critical",
      status: "pending",
      liveLocation: { lat: 19.213, lng: 72.978, addressStr: "Eastern Express Highway, Thane" },
      requestedAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  ];

  const requests = await EmergencyRequest.insertMany(emergencyData);
  console.log(`✅ ${requests.length} emergency requests inserted.\n`);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log("═════════════════════════════════════════════════════");
  console.log("🎉 Seed complete!");
  console.log("");
  console.log("  Demo Users:");
  usersData.forEach((u) => console.log(`    ${u.email.padEnd(22)} / ${u.password}  (${u.location.city})`));
  console.log("");
  console.log("  Demo Admins:");
  buildAdmins(hospitals).forEach((a, i) => {
    const h = hospitals.find((h) => h._id.equals(a.hospitalId));
    console.log(`    ${a.email.padEnd(22)} / ${a.password}  → ${h?.name}`);
  });
  console.log("═════════════════════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
