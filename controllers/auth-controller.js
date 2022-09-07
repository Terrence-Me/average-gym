const User = require('../models/user-model');
const authUtil = require('../util/authentication');

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

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  const existingUser = await user.getUserWithEmail();

  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  const passwordIsCorrect = await user.comparePassward(existingUser.password);

  if (!passwordIsCorrect) {
    res.redirect('/login');
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
};
