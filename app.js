require('dotenv').config();

const cookieParser = require('cookie-parser');
const express      = require('express');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


// WHEN INTRODUCING USERS DO THIS:
// INSTALL THESE DEPENDENCIES: passport-local, passport, bcryptjs, express-session
// AND UN-COMMENT OUT FOLLOWING LINES:

// const session       = require('express-session');
// const passport      = require('passport');

// require('./configs/passport');

// IF YOU STILL DIDN'T, GO TO 'configs/passport.js' AND UN-COMMENT OUT THE WHOLE FILE

mongoose
  .connect('mongodb://localhost/project-management-server', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express setup

app.use(express.static(path.join(__dirname, 'public')));

// ADD SESSION SETTINGS HERE:


// USE passport.initialize() and passport.session() HERE:


// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:


// ROUTES MIDDLEWARE STARTS HERE:

// const index = require('./routes/index');
// app.use('/', index);

app.use('/api', require('./routes/project-routes'));
// app.use('/api', require('./routes/task-routes'));


module.exports = app;
