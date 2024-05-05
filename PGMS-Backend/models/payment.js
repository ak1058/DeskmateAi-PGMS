const mongoose = require('mongoose');
const shortid = require('shortid');
const paymentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tenant' },
  pgId: { type: String, required: true },
  paymentId: { type: String, default: shortid.generate },
  type: {type: String, enum: ['rent', 'securityDeposit', 'balance', 'other'], default: 'pending'},
  mode: { type: String, enum: ['cash', 'upi'], default: 'cash' },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  rentMonth: {type: String}
});

module.exports = mongoose.model('Payment', paymentSchema);
