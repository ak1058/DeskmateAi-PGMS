const Tenant = require("../models/tenantModel");
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const uniqid = require('uniqid');
const sha256 = require('sha256')
const SECRET_KEY = process.env.SECRET_KEY;
const PHONEPAY_PAY_HOSTURL = process.env.PHONEPAY_PAY_HOSTURL;
const PHONEPAY_MERCHANTID = process.env.PHONEPAY_MERCHANTID;
const SALT_KEY = process.env.SALT_KEY;
const SALT_INDEX = process.env.SALT_INDEX;

// Tenant Registration
// exports.registerTenant = async (req, res) => {
//   try {
//     const { tenantName, tenantEmail, tenantPassword, tenantAddress, tenantAadharNumber, tenantAadharCardPdfUrl, tenantPhoneNo, tenantImageUrl, pgId, pgName, monthlyRent, securityDeposit} = req.body;


//     const existingTenant = await Tenant.Tenant.findOne({ $or: [{ tenantEmail }, { tenantPhoneNo }] });
//     if (existingTenant) {
//       return res.status(400).send({ message: 'Tenant already exists with given email or phone number.' });
//     }

//     // Hash tenant's password
//     const hashedPassword = await bcrypt.hash(tenantPassword, 10);
    

//     // Create a new tenant
//     const tenant = await Tenant.Tenant.create({
//       tenantName,
//       tenantEmail,
//       tenantPassword: hashedPassword,
//       tenantAddress,
//       tenantAadharNumber,
//       tenantAadharCardPdfUrl,
//       tenantPhoneNo,
//       tenantImageUrl,
//       pgId,
//       pgName,
//       currentDate,
//       monthlyRent,
//       securityDeposit,

//     });

   
//     const token = jwt.sign({ tenantEmail: tenantEmail, tenantId: tenant._id }, SECRET_KEY);

//     res.status(201).send({ tenant: tenant, token: token, message: 'Tenant registered successfully', tenantId: tenant._id });
//   } catch (error) {
//     res.status(500).send({ message: 'Error registering tenant', error: error.message });
//   }
// };

// Tenant Registration
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, tenantEmail, tenantPassword } = req.body;

    // Check if tenant already exists
    const existingTenant = await Tenant.Tenant.findOne({ $or: [{ tenantEmail }] });
    if (existingTenant) {
      return res.status(400).send({ message: 'Tenant already exists with given email.' });
    }

    // Hash tenant's password
    const hashedPassword = await bcrypt.hash(tenantPassword, 10);
    const tenant = await Tenant.Tenant.create({
      tenantName,
      tenantEmail,
      tenantPassword: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ tenantEmail: tenantEmail, tenantId: tenant._id }, SECRET_KEY);

    res.status(201).send({ tenant: tenant, token: token, message: 'Tenant registered successfully', tenantId: tenant._id });
  } catch (error) {
    res.status(500).send({ message: 'Error registering tenant', error: error.message });
  }
};

// Function to update additional details of a registered tenant
exports.registerTenantForPG = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { tenantAddress, tenantAadharNumber, tenantAadharCardPdfUrl, tenantPhoneNo, tenantImageUrl, pgId, pgName, monthlyRent, securityDeposit } = req.body;
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    // Update tenant details
    const updatedTenant = await Tenant.Tenant.findByIdAndUpdate(tenantId, {
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
      isRegisteredWithPg: true
    }, { new: true });

    res.status(200).send({ tenant: updatedTenant, message: 'Tenant registered for Pg successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating tenant details', error: error.message });
  }
};

// Tenant Login
exports.loginTenant = async (req, res) => {
  try {
    const { tenantEmail, tenantPassword } = req.body;

    // Check if tenant exists
    const existingTenant = await Tenant.Tenant.findOne({ $or: [{ tenantEmail }] });
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


// phone pay mayment integration 
exports.handlePayment = async(req, res) =>{

  
  console.log("hiii")
  const tenantId = "req.data.tenantId";
  const merchantTransactionId = uniqid();
const payload = {
  "merchantId": PHONEPAY_MERCHANTID,
  "merchantTransactionId": merchantTransactionId,
  "merchantUserId": tenantId,
  "amount": 10000,
  "redirectUrl": `http://localhost:3000/tenant/redirect-url/${merchantTransactionId}`,
  "redirectMode": "REDIRECT",
 
  "mobileNumber": "9999999999",
  "paymentInstrument": {
    "type": "PAY_PAGE"
  }
}


//SHA256(Base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index

const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
const Base64EncodedPayload = bufferObj.toString('base64')
const xVerify = sha256(Base64EncodedPayload + "/pg/v1/pay" + SALT_KEY)  + "###" + SALT_INDEX



const options = {
  method: 'post',
  url: `${PHONEPAY_PAY_HOSTURL}/pg/v1/pay`,
  headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Verify': xVerify
				},
data: {
  request: Base64EncodedPayload
}
};
axios
  .request(options)
      .then(function (response) {
      console.log(response.data);
      
      const url = response.data.data.instrumentResponse.redirectInfo.url;
      res.redirect(url);
  })
  .catch(function (error) {
    console.error(error.message);
  });
}

exports.getResponse = async(req, res) =>{
  console.log("nnn")
  const id = req.params
  res.send(id);
}







