// Аутентификация middleware-і

const isAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Қол жеткізу тыйым салынған');
};

module.exports = { isAuth, isAdmin };
