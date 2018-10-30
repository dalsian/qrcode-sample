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
const moment = require('moment');

const data = require('../common/mock-data');
// const validateToken = require('../common/validateToken');
// const validationPattern = require('../common/validationPattern');
const logger = require('../common/logger');
const apple_notification = require('../services/apple-notification');

const router = express.Router();

/* Validation of fields */
const STRUCTURE_FIELDS = [
  'auxiliaryFields',
  'backFields',
  'headerFields',
  'primaryFields',
  'secondaryFields'
];
const updateObject = Joi.object().keys({
  field: Joi.string().required(),
  key: Joi.string().when('field', { is: Joi.any().valid(STRUCTURE_FIELDS), then: Joi.required() }),
  value: Joi.any().required()
});
const updateValidation = {
  body: {
    update: Joi.array().items(updateObject).required()
  }
};


/* create APN provider for push notifications */
const options = {
  cert: path.join(appRoot, config.KEYS_PATH, config.CERT_FILE),
  key: path.join(appRoot, config.KEYS_PATH, config.KEY_FILE),
  passphrase: config.PASSPHRASE,
  production: true
};
const apnProvider = new apn.Provider(options);

const validateToken = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization) {
    const token = authorization.split(' ')[1] || authorization.split(' ')[0];
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    bcrypt.compare(config.TOKEN_SECRET, decoded, (err, match) => {
      logger.info(`Match ${match}`);
      if (err) next({ status: 401, message: `Authorization: ${err}` });
      else if (!match) next({ status: 401, message: 'Authorization failure: auth token doesn\'t match' });
      else next();
    });
  } else {
    next({ status: 401, message: `Authorization NOT found in header for ${req.url}` });
  }
};

/*
 * Update pass fields and send Push Notification
 */
// router.post('/update/:serialNumber', validateToken, validate(validationPattern.appleNotificationValidation), (req, res) => {
//   const result = apple_notification.updatePass(req.params.serialNumber, req.body);
//   res.status(result.status).json({msg: result.msg}).end();
// });
router.post('/update/:serialNumber', validateToken, validate(updateValidation), (req, res) => {
  console.log('Update');
  console.log(req.params);
  console.log(req.body);

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

  console.log(">>>>> CHK 1 >>>>>");

  if (!updated) {
    console.log("!!! NOT UPDATED");
    res.status(200).end();
    return;
  }

  console.log(">>>>> CHK 2 >>>>>");

  foundPass.lastUpdated = moment().unix();

  console.log(">>>>> CHK 3 >>>>>");

  /* get all registrations for all devices associated with pass and send push */
  const registrations = _.filter(data.registrations,
    reg => reg.serialNumber === req.params.serialNumber);
  const tokens = [];
  registrations.forEach((reg) => {
    const device = _.find(data.devices, dev => dev.deviceId === reg.deviceId);
    tokens.push(device.pushToken);
  });

  console.log(">>>>> CHK 4 >>>>>");

  if (tokens.length) {
    const note = new apn.Notification({}); // always send an empty body
    console.log(">>>>> CHK 5 >>>>>");
    tokens.forEach((t) => {
      console.log("+++++++ token ++++  " + t);
    });
    console.log('Sending apn');
    console.log(">>>>>>> Notification Payload >>>>>> " + util.inspect(note, {showHidden: false, depth: null}));

    apnProvider.send(note, tokens).then((result) => {
      console.log('sent: ', result.sent.length);
      console.log('failed: ', result.failed.length);
      if (result.failed.length) res.status(500).json(result.failed);
      else res.status(200).end();
    });
  } else {
    console.log(">>>>> CHK 6 >>>>>");
    res.status(200).end();
  }
});

// router.use((err, req, res, next) => {
//   logger.error(err.status);
//   console.log("!!!" + err.status);
//   res.status(err.status || 500).json(err);
// });

module.exports = router;
