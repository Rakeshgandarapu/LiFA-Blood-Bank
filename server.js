 require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE ================= //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ================= MONGODB CONNECTION ================= //
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/donorDB";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ================= DONOR SCHEMA ================= //
const donorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number },
    weight: { type: Number },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    lastDonated: { type: String, default: "Never" },
    healthIssues: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);

// ================= STATIC PAGE ROUTES ================= //
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "home.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "register.html"))
);
app.get("/donors", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "donors.html"))
);
app.get("/location", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "location.html"))
);

// ================= API ROUTES ================= //

// Register new donor
app.post("/api/register", async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      age,
      weight,
      bloodGroup,
      city,
      email,
      password,
      lastDonated,
      healthIssues,
    } = req.body;

    if (!fullName || !mobile || !bloodGroup || !city) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existingDonor = await Donor.findOne({ mobile });
    if (existingDonor) {
      return res
        .status(400)
        .json({ message: "Donor already registered with this mobile number." });
    }

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newDonor = new Donor({
      fullName,
      mobile,
      age,
      weight,
      bloodGroup,
      city,
      email,
      password: hashedPassword,
      lastDonated: lastDonated || "Never",
      healthIssues: healthIssues || [],
    });

    await newDonor.save();

    return res.status(201).json({ message: "✅ Registration Successful", donor: newDonor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all donors
app.get("/api/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get donors by city
app.get("/api/donors/by-city", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ message: "City is required" });

    const donors = await Donor.find({ city });
    res.json({ donors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= START SERVER ================= //
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
