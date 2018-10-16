/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^r|next" } ] */
/*
 * Copyright 2018 Topcoder Inc.
 */
const path = require('path');
const config = require('config');
const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');
const cookieParser = require('cookie-parser');

const logger = require('./src/common/logger');

/* project root folder */
global.appRoot = path.resolve(__dirname);

const passApi = require('./routes/pass-api');

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
app.use(express.static(path.join(__dirname, 'public')));

/* api definition (v1 is the current version of the API) */
app.use('/v1', passApi);

/* default error handler */
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
