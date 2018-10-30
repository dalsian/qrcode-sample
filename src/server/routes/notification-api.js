/**
 * Module dependencies.
 */
const _ = require('lodash');
const express = require('express');
const validate = require('express-validation');
const util = require('util');

const data = require('../common/mock-data');
const validateToken = require('../common/validateToken');
const validationPattern = require('../common/validationPattern');
const logger = require('../common/logger');
const apple_notification = require('../services/apple-notification');

const router = express.Router();

/*
 * Update pass fields and send Push Notification
 */
router.post('/update/:serialNumber', validateToken, validate(validationPattern.appleNotificationValidation), (req, res) => {
  const result = apple_notification.updatePass(req.params.serialNumber, req.body);
  res.status(result.status).json({msg: result.msg});
});

module.exports = router;
