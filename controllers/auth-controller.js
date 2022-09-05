const User = require('../models/user-model');

function getSignup(req, res, next) {
  res.render('auth/signup');
}

async function signup(req, res, next) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.firstname,
    req.body.lastname
  );

  await user.signup();

  res.redirect('/login');
}

function getLogin(req, res, next) {
  res.render('auth/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
};
