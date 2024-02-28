const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedId: { type: String, required: true },
  occupancyStatus: { type: Boolean, default: false } 
});

const roomSchema = new mongoose.Schema({
  roomNumberId: { type: String, required: true },
  sharingType: {
    type: String,
    required: true,
    enum: ['single', 'double', 'triple', 'quadruple'],
    default: 'single'
  },
  price: { type: Number },  // not requiered at the time of setting up the pg
  beds: [bedSchema] 
});

const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true },
  rooms: [roomSchema]
});

const pgSchema = new mongoose.Schema({
  adminId: {type: String, required: true },
  pgName: { type: String, required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), auto: true },
  totalFloors: { type: Number, required: true },
  floors: [floorSchema]
});

const PG = mongoose.model('PG', pgSchema);

module.exports = PG;
