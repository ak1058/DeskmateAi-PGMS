const Tenant = require("../models/tenantModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Tenant Registration
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, tenantEmail, tenantPassword, tenantAddress, tenantAadharNumber, tenantAadharCardPdfUrl, tenantPhoneNo, pgName, tenantImageUrl } = req.body;


    const existingTenant = await Tenant.findOne({ $or: [{ tenantEmail }, { tenantPhoneNo }] });
    if (existingTenant) {
      return res.status(400).send({ message: 'Tenant already exists with given email or phone number.' });
    }

    // Hash tenant's password
    const hashedPassword = await bcrypt.hash(tenantPassword, 10);

    // Create a new tenant
    const tenant = await Tenant.create({
      tenantName,
      tenantEmail,
      tenantPassword: hashedPassword,
      tenantAddress,
      tenantAadharNumber,
      tenantAadharCardPdfUrl,
      tenantPhoneNo,
      pgName,
      tenantImageUrl
    });

   
    const token = jwt.sign({ tenantEmail: tenantEmail, tenantId: tenant._id }, SECRET_KEY);

    res.status(201).send({ tenant: tenant, token: token, message: 'Tenant registered successfully', tenantId: tenant._id });
  } catch (error) {
    res.status(500).send({ message: 'Error registering tenant', error: error.message });
  }
};

// Tenant Login
exports.loginTenant = async (req, res) => {
  try {
    const { tenantEmail, tenantPhoneNo, tenantPassword } = req.body;

    // Check if tenant exists
    const existingTenant = await Tenant.findOne({ $or: [{ tenantEmail }, { tenantPhoneNo }] });
    if (!existingTenant) {
      return res.status(404).send({ message: 'Tenant not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(tenantPassword, existingTenant.tenantPassword);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ tenantEmail: tenantEmail, tenantId: existingTenant._id }, SECRET_KEY);

    res.send({ tenant: existingTenant, token: token, message: 'Login successful', tenantId: existingTenant._id });
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
};
