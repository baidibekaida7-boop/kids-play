const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// GET — Тіркелу формасы
router.get('/register', (req, res) => {
  res.render('register', { title: 'Тіркелу', errors: [] });
});

// POST — Тіркелу
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Пайдаланушы аты кемінде 3 таңба'),
  body('email').isEmail().withMessage('Дұрыс email енгізіңіз'),
  body('password').isLength({ min: 6 }).withMessage('Пароль кемінде 6 таңба')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', { title: 'Тіркелу', errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    // Email бар-жоғын тексеру
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Тіркелу',
        errors: [{ msg: 'Бұл email тіркелген' }]
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Сервер қатесі');
  }
});

// GET — Кіру формасы
router.get('/login', (req, res) => {
  res.render('login', { title: 'Кіру', errors: [] });
});

// POST — Кіру
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', {
        title: 'Кіру',
        errors: [{ msg: 'Email немесе пароль қате' }]
      });
    }

    req.session.user = { id: user._id, username: user.username, role: user.role };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Сервер қатесі');
  }
});

// GET — Шығу
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
