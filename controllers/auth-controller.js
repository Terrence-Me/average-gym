const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const userDetailsAreValid = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
    };
  }

  res.render('auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (
    !userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.firstname,
      req.body.lastname
    )
  ) {
    sessionFlash.flashDataSession(
      req,
      {
        errorMessage: 'please check your input',
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.firstname,
    req.body.lastname
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataSession(
        req,
        {
          errorMessage: 'user exists already, try loging in',
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );

      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/login');
}

function getLogin(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  const existingUser = await user.getUserWithEmail();

  const sessionErrorData = {
    errorMessage: 'invalid credentials',
    email: req.body.email,
    password: req.body.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await user.comparePassward(existingUser.password);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
