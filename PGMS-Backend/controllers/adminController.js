const Admin = require("../models/adminModel")
const bcrypt = require('bcrypt');

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { email, phoneNumber, adminName, pgName, password, address } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingAdmin) {
      return res.status(400).send({ message: 'Admin already exists with given email or phone number.' });
    }

    // Create a new admin
    const admin = await Admin.create({
      email,
      phoneNumber,
      adminName,
      pgName,
      password,
      address
    });

    res.status(201).send({ message: 'Admin registered successfully', adminId: admin._id });
  } catch (error) {
    res.status(500).send({ message: 'Error registering admin', error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    res.send({ message: 'Login successful', adminId: admin._id });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
};
