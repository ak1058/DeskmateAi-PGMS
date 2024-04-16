const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  tenantEmail: { type: String, required: true, unique: true },
  tenantPassword: { type: String, required: true },
  tenantAddress: {
    city: String,
    state: String,
    area: String,
    pincode: String
  },
  tenantAadharNumber: { type: String },
  tenantAadharCardPdfUrl: { type: String },
  tenantPhoneNo: { type: String },
  tenantImageUrl: {type: String},
  pgId: { type: String },
  pgName: { type: String },
  tenantDoj: { type: Date, default: Date.now },
  monthlyRent: { type: String},
  securityDeposit: { type: String},

});


//currently no use 
const tenantPgDetails = new mongoose.Schema({
  pgName: {type: String, require: true},
  tenantId: {type: String, require: true},
  tenantDoj: {type: String, require: true},

});

const tenantPaymentDetails = new mongoose.Schema({
  tenantId: {type: String, require: true},
  paymentId: {type: String, require: true},
  paymentStatus:  { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  paymentMode: { type: String, enum: ['upi', 'cash'], required: true },
  paymentDate: { type: Date, default: Date.now }
});



const Tenant = mongoose.model('Tenant', tenantSchema);
const TenantPG = mongoose.model('TenantPG', tenantPgDetails);
const TenantPayment = mongoose.model('TenantPayment', tenantPaymentDetails);

module.exports = {Tenant, TenantPG, TenantPayment};
