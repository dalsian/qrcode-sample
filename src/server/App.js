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
const cors = require('cors');
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
app.use(cors());
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


/* default error handler */
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json(err);
});
// var allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }
// app.use(allowCrossDomain);



console.log('Andy', config.API_VERSION, config.API_PORT)

module.exports = app;
