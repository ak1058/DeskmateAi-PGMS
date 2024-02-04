const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  adminName: { type: String, required: true },
  pgName: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    city: String,
    state: String,
    area: String,
    pincode: String
  }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
