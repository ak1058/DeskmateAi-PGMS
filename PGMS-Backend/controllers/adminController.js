const Admin = require("../models/adminModel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const PG = require('../models/roomModel');

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPhoneNumber, adminName, pgName, adminPassword, adminAddress, pgImageUrl} = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ adminEmail }, { adminPhoneNumber }] });
    if (existingAdmin) {
      return res.status(400).send({ message: 'Admin already exists with given email or phone number.' });
    }
    //hashed password
        const hashAdminPassword = await bcrypt.hash(adminPassword, 10);
        

    // Create a new admin
    const admin = await Admin.create({
      adminEmail,
      adminPhoneNumber,
      adminName,
      pgName,
      adminPassword:hashAdminPassword,
      adminAddress,
      pgImageUrl
    });

    console.log(admin)
    //generating jwt token

        const token = jwt.sign({adminEmail : adminEmail, adminId : admin._id}, SECRET_KEY);

        

    res.status(201).send({admin : admin, token : token, message: 'Admin registered successfully', adminId: admin._id });
  } catch (error) {
    res.status(500).send({ message: 'Error registering admin', error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ adminEmail });
    if (!existingAdmin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(adminPassword, existingAdmin.adminPassword);
   
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({adminEmail : adminEmail, adminId : existingAdmin._id}, SECRET_KEY);
    res.send({ admin: existingAdmin, token: token, message: 'Login successful', adminId: existingAdmin._id });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
};








// PG Setup Function
exports.setupPG = async (req, res) => {
  try {
    // Extract admin details from the request (provided by auth middleware)
    const adminId = req.data.adminId;

    // Extract data for setting up PG structure from request body
    const { pgName, totalFloors, floors } = req.body;

    // Construct the PG structure based on the provided data
    const newPG = await PG.create({
      adminId,
      pgName,
      totalFloors,
      floors
    });

    res.status(201).json({ message: 'PG created successfully', pgDetails: newPG });
  } catch (error) {
    res.status(500).json({ message: 'Error setting up PG', error: error.message });
  }
};

