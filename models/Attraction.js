const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Аттракцион атауы міндетті'],
    trim: true,
    maxlength: [100, 'Атау 100 таңбадан аспауы керек']
  },
  description: {
    type: String,
    required: [true, 'Сипаттама міндетті'],
    maxlength: [500, 'Сипаттама 500 таңбадан аспауы керек']
  },
  category: {
    type: String,
    enum: ['батуттар', 'лабиринт', 'каруссель', 'аквапарк', 'басқа'],
    default: 'басқа'
  },
  minAge: {
    type: Number,
    default: 3
  },
  maxAge: {
    type: Number,
    default: 14
  },
  price: {
    type: Number,
    required: [true, 'Баға міндетті'],
    min: [0, 'Баға теріс болмауы керек']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attraction', attractionSchema);
// updated
