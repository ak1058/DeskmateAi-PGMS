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
  tenantAadharNumber: { type: String, required: true, unique: true },
  tenantAadharCardPdfUrl: { type: String },
  tenantPhoneNo: { type: String, required: true, unique: true },
  pgName: { type: String },
  tenantImageUrl: {type: String}
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
