const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB қосылуы
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kids-play')
  .then(() => console.log('MongoDB-ге қосылды'))
  .catch(err => console.error('MongoDB қатесі:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Сессия конфигурациясы
app.use(session({
  secret: process.env.SESSION_SECRET || 'kids-play-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// EJS шаблон движогі
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Маршруттар
const attractionRoutes = require('./routes/attractionRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/', attractionRoutes);
app.use('/auth', authRoutes);

// Сервер іске қосу
app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} мекенжайында іске қосылды`);
});

module.exports = app;
