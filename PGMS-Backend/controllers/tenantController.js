const Tenant = require("../models/tenantModel");

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Tenant Registration
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, tenantEmail, tenantPassword, tenantAddress, tenantAadharNumber, tenantAadharCardPdfUrl, tenantPhoneNo, tenantImageUrl, pgId, pgName, monthlyRent, securityDeposit} = req.body;


    const existingTenant = await Tenant.Tenant.findOne({ $or: [{ tenantEmail }, { tenantPhoneNo }] });
    if (existingTenant) {
      return res.status(400).send({ message: 'Tenant already exists with given email or phone number.' });
    }

    // Hash tenant's password
    const hashedPassword = await bcrypt.hash(tenantPassword, 10);
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Create a new tenant
    const tenant = await Tenant.create({
      tenantName,
      tenantEmail,
      tenantPassword: hashedPassword,
      tenantAddress,
      tenantAadharNumber,
      tenantAadharCardPdfUrl,
      tenantPhoneNo,
      tenantImageUrl,
      pgId,
      pgName,
      currentDate,
      monthlyRent,
      securityDeposit,

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
    const existingTenant = await Tenant.Tenant.findOne({ $or: [{ tenantEmail }, { tenantPhoneNo }] });
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


// tenant PymentDetailsRecord

  //settingPayment
exports.setToPaymentRecords = async (req, res) => {
  try {
    // Extract tenant details from the request (provided by auth middleware)
    const tenantId = req.data.tenantId;
    const {paymentId, paymentStatus, paymentMode } = req.body;

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Create tenant payment record
    const paymentRecord = await Tenant.TenantPayment.create({
      tenantId,
      paymentId,
      paymentStatus,
      paymentMode,
      paymentDate: currentDate 
    });

    res.status(201).json({ message: 'Payment done successfully', paymentRecord });
  } catch (error) {
    res.status(500).json({ message: 'Error in payment', error: error.message });
  }
};

    //gettingPayments
exports.getPaymentRecordsByTenantId = async (req, res) => {
  try {
    // Extract tenant ID from the request (provided by auth middleware)
    const tenantId = req.data.tenantId;

    // Find all payment records for the tenant ID
    const paymentRecords = await TenantPayment.find({ tenantId });

    res.status(200).json({ message: 'Payment records fetched successfully', paymentRecords });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment records', error: error.message });
  }
};






