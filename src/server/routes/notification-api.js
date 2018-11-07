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
  const update = apple_notification.updatePass(req.params.serialNumber, req.body);
  update.then((result) => {
    console.log("Result>>>"+result);
    res.status(result.status).json({msg: result.msg});
  }).catch((err) => {
    res.status(500).json({errMsg: err});
  });
});

router.post('/update_all', validateToken, validate(validationPattern.appleNotificationValidation), (req, res) => {
  const update = apple_notification.updateAllPass(req.body);
  update.then((result) => {
    console.log("Result>>>"+result);
    res.status(result.status).json({msg: result.msg});
  }).catch((err) => {
    res.status(500).json({errMsg: err});
  });
});


module.exports = router;
