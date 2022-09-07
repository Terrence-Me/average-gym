const path = require('path');

const csrf = require('csurf');
const express = require('express');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const csrfMiddleware = require('./middlewares/csrf-token');
const checkAuthStatus = require('./middlewares/check-auth');

const authRoutes = require('./routes/auth-routes');
const baseRoute = require('./routes/base-routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());
app.use(csrfMiddleware);
app.use(checkAuthStatus);

app.use(baseRoute);
app.use(authRoutes);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
    console.log('connected to db');
  })
  .catch(function (error) {
    console.log('Failed to connect to db');
    console.log(error);
  });
