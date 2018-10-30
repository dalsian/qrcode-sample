/**
 * Module dependencies.
 */
const path = require('path');
const config = require('config');
const express = require('express');
const winston = require('winston');
const compression = require('compression');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');

const logger = require('./common/logger');

/* project root folder */
global.appRoot = path.resolve(__dirname);


const commonApi = require('./routes/common-api');
const applePassApi = require('./routes/apple-pass-api');
const notificationApi = require('./routes/notification-api');
const qrGenApi = require('./routes/qr-gen-api');
const rewardsApi = require('./routes/rewards-api');
const testApi = require('./routes/test-api');

const app = express();

/* express configuration */
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      level: config.LOG_LEVEL,
      json: true,
      colorize: true
    })
  ],
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true,
  ignoreRoute: (req, res) => false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('dist'));

/* api definition (v1 is the current version of the API) */
app.use(config.API_VERSION, commonApi);
app.use(config.API_VERSION, applePassApi);
app.use(config.API_VERSION, notificationApi);
app.use(config.API_VERSION, qrGenApi);
app.use(config.API_VERSION, rewardsApi);
app.use(config.API_VERSION, testApi);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../../../dist/index.html'));
});

/* default error handler */
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
