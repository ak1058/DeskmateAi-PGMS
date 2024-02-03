const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumberId: { type: String, required: true },
  sharingType: {
    type: String,
    required: true,
    enum: ['single', 'double', 'triple', 'quadruple'],
    default: 'single'
  }
});

const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  rooms: [roomSchema]
});

const pgSchema = new mongoose.Schema({
  pgName: { type: String, required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), auto: true },
  totalFloors: { type: Number, required: true },
  floors: [floorSchema]
});

const PG = mongoose.model('PG', pgSchema);

module.exports = PG;
