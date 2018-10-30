/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');
const express = require('express');
const Joi = require('joi');
const config = require('config');
const apn = require('apn');
const validate = require('express-validation');

const data = require('../common/mock-data');
const validateToken = require('../common/validateToken');
const validationPattern = require('../common/validationPattern');
const logger = require('../common/logger');

const router = express.Router();

/* create APN provider for push notifications */
const options = {
  cert: path.join(appRoot, config.KEYS_PATH, config.CERT_FILE),
  key: path.join(appRoot, config.KEYS_PATH, config.KEY_FILE),
  passphrase: config.PASSPHRASE,
  production: true
};
const apnProvider = new apn.Provider(options);

/*
 * Update pass fields and send Push Notification
 */
router.post('/update/:serialNumber', validateToken, validate(validationPattern.appleNotificationValidation), (req, res) => {
  logger.debug('Update');
  logger.debug(req.params);
  logger.debug(req.body);

  const foundPass = _.find(data.passes, p => p.serialNumber === req.params.serialNumber);
  if (!foundPass) {
    res.status(404).json(`Pass with serial number ${req.params.serialNumber} not found`);
    return;
  }

  let updated = false;
  _.forEach(req.body.update, (item) => {
    if (foundPass.pass[item.field]) {
      if (item.key) foundPass.pass[item.field].setValue(item.key, item.value);
      else foundPass.pass[item.field](item.value);
      updated = true;
    }
  });
  if (!updated) {
    res.status(200).end();
    return;
  }

  foundPass.lastUpdated = moment().unix();

  /* get all registrations for all devices associated with pass and send push */
  const registrations = _.filter(data.registrations,
    reg => reg.serialNumber === req.params.serialNumber);
  const tokens = [];
  registrations.forEach((reg) => {
    const device = _.find(data.devices, dev => dev.deviceId === reg.deviceId);
    tokens.push(device.pushToken);
  });
  if (tokens.length) {
    const note = new apn.Notification({}); // always send an empty body
    note.payload = {'messageFrom': 'Hey User!!!'};
    logger.debug('Sending apn');
    apnProvider.send(note, tokens).then((result) => {
      logger.debug('sent: ', result.sent.length);
      logger.error('failed: ', result.failed.length);
      if (result.failed.length) res.status(500).json(result.failed);
      else res.status(200).end();
    });
  } else {
    res.status(200).end();
  }
});

router.use((err, req, res, next) => {
  logger.error(err.status);
  res.status(err.status || 500).json(err);
});

module.exports = router;
