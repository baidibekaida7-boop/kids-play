const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Пайдаланушы аты міндетті'],
    unique: true,
    trim: true,
    minlength: [3, 'Пайдаланушы аты кемінде 3 таңба болуы керек']
  },
  email: {
    type: String,
    required: [true, 'Email міндетті'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Пароль міндетті'],
    minlength: [6, 'Пароль кемінде 6 таңба болуы керек']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Паролді сақтар алдында хэштеу
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Парольді тексеру әдісі
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
// auth
