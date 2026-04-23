const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Attraction = require('../models/Attraction');
const { isAuth } = require('../middleware/authMiddleware');

// GET — Барлық аттракциондарды қарау (Басты бет)
router.get('/', async (req, res) => {
  try {
    const attractions = await Attraction.find({ isAvailable: true });
    res.render('index', {
      title: 'Балалар ойын орталығы',
      attractions,
      user: req.session.user || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Сервер қатесі');
  }
});

// GET — Жаңа аттракцион қосу формасы (тек admin)
router.get('/add', isAuth, (req, res) => {
  res.render('add', {
    title: 'Аттракцион қосу',
    user: req.session.user
  });
});

// POST — Жаңа аттракцион қосу
router.post('/add', isAuth, [
  body('name').notEmpty().withMessage('Атауы міндетті'),
  body('description').notEmpty().withMessage('Сипаттама міндетті'),
  body('price').isNumeric().withMessage('Баға сан болуы керек')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('add', {
      title: 'Аттракцион қосу',
      errors: errors.array(),
      user: req.session.user
    });
  }

  try {
    const attraction = new Attraction(req.body);
    await attraction.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Сервер қатесі');
  }
});

// GET — Dashboard (барлық аттракциондар)
router.get('/dashboard', isAuth, async (req, res) => {
  try {
    const attractions = await Attraction.find().sort({ createdAt: -1 });
    res.render('dashboard', {
      title: 'Басқару панелі',
      attractions,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Сервер қатесі');
  }
});

// DELETE — Аттракционды жою
router.delete('/attraction/:id', isAuth, async (req, res) => {
  try {
    await Attraction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Аттракцион жойылды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Қате орын алды' });
  }
});

module.exports = router;
// routes updated

// GET — Баға пакеттері беті
router.get('/prices', (req, res) => {
  res.render('prices', {
    title: 'Баға пакеттері',
    user: req.session.user || null
  });
});

// GET — Брондау беті
router.get('/booking', (req, res) => {
  res.render('booking', {
    title: 'Орын брондау',
    user: req.session.user || null
  });
});

// POST — Брондауды сақтау
router.post('/booking', async (req, res) => {
  try {
    const { name, phone, date, package: pkg, children, comment } = req.body;
    console.log('Жаңа брондау:', { name, phone, date, pkg, children, comment });
    res.redirect('/?booked=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Брондау қатесі');
  }
});
