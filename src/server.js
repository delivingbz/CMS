import express from "express";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import cors from "cors";
import User from "../models/user.js";
import Contact from "../models/contact.js";

const app = express();
app.use(express.json());
app.use(cors());
// dotenv.config();

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://cms_db:lmHMYD6LmeekR2Eo@cluster0.amjujxl.mongodb.net/cms?retryWrites=true&w=majority"
  )
  .then(() => console.log("✔️MongoDB connected"))
  .catch((err) => console.log("❌MongoDB connection error:", err));

//Reggistration endpoint
app.post("/register", async (req, res) => {
  const { firstName, lastName, userEmail, userNumber, userPassword } = req.body;
  try {
    // Check if email already exists
    const existUser = await User.findOne({ userEmail });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      userEmail,
      userNumber,
      userPassword,
    });

    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Login endpoint
app.post("/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;
  console.log("Login attempt:", userEmail, userPassword);
  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (user.userPassword !== userPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/contacts", async (req, res) => {
  const { name, email, phone, tag } = req.body;
  try {
    // You should have a Contact model similar to your User model
    const newContact = new Contact({ name, email, phone, tag });
    await newContact.save();
    res.json({ success: true, message: "Contact added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//fetch contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
