/**
 * Module dependencies.
 */
const _ = require('lodash');
// const path = require('path');
const express = require('express');
// const Joi = require('joi');
// const config = require('config');
// const apn = require('apn');
const validate = require('express-validation');

// const data = require('../common/mock-data');
const validateToken = require('../common/validateToken');
const validationPattern = require('../common/validationPattern');
const logger = require('../common/logger');

const apple_notification = require('../services/apple-notification');

const router = express.Router();

/* create APN provider for push notifications */
// const options = {
//   cert: path.join(appRoot, config.KEYS_PATH, config.CERT_FILE),
//   key: path.join(appRoot, config.KEYS_PATH, config.KEY_FILE),
//   passphrase: config.PASSPHRASE,
//   production: true
// };
// const apnProvider = new apn.Provider(options);

/*
 * Update pass fields and send Push Notification
 */
router.post('/update/:serialNumber', validateToken, validate(validationPattern.appleNotificationValidation), (req, res) => {
  const result = apple_notification.updatePass(req.params.serialNumber, req.body);
  res.status(result.status).json({msg: result.msg});
});

router.use((err, req, res, next) => {
  logger.error(err.status);
  res.status(err.status || 500).json(err);
});

module.exports = router;
