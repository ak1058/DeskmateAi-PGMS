const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true, unique: true },
  adminPhoneNumber: { type: String, required: true, unique: true },
  adminName: { type: String, required: true },
  pgName: { type: String, required: true },
  pgId: { type: String, required: true },
  pgImageUrl: {type: String},
  adminPassword: { type: String, required: true },
  adminAddress: {
    city: String,
    state: String,
    area: String,
    pincode: String
  }
});



const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
