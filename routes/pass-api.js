/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
/* global appRoot */
/*
 * Copyright 2018 Topcoder Inc.
 */
const _ = require('lodash');
const path = require('path');
const apn = require('apn');
const Joi = require('joi');
const config = require('config');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const express = require('express');
const validate = require('express-validation');

const logger = require('../src/common/logger');
const handlePass = require('../src/services/create-pass');

const router = express.Router();

// Reference of implementation
// https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html
// https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Updating.html#//apple_ref/doc/uid/TP40012195-CH5-SW1

// Pass identifier
const passTypeIdentifier = config.PASS_TYPE_IDENTIFIER;

/* Memory datastore - change to MongoDB?? */
const data = {
  devices: [],
  passes: [],
  registrations: []
};

/* create APN provider for push notifications */
const options = {
  cert: path.join(appRoot, config.KEYS_PATH, config.CERT_FILE),
  key: path.join(appRoot, config.KEYS_PATH, config.KEY_FILE),
  passphrase: config.PASSPHRASE,
  production: true
};
const apnProvider = new apn.Provider(options);

/**
 * Check authorization token.
 *
 * @param {Object} req the http request
 * @param {Object} res the http response
 * @param {Function} next call the next function in chain
 */
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

/**
 * Getting the Latest Version of a Pass
 */
router.get(`/passes/${passTypeIdentifier}/:serialNumber`, validateToken, (req, res, next) => {
  logger.debug('Get Passes');
  logger.debug(req.params);

  const foundPass = _.find(data.passes, p => p.serialNumber === req.params.serialNumber);
  if (foundPass) {
    /* Check for modify since header */
    if (req.get('If-Modified-Since')) {
      const modified = moment(req.get('If-Modified-Since'));
      if (moment(foundPass.lastUpdated).isSameOrBefore(modified)) {
        res.status(304).end();
        return;
      }
    }

    /* send the pass back to user */
    res.status(200);
    res.append('Last-Modified', moment(foundPass.lastUpdated).toDate().toUTCString());
    foundPass.pass.render(res).catch(err => next(err));
  } else {
    res.status(404).end();
  }
});

/**
 * Getting the Serial Numbers for Passes Associated with a Device.
 */
router.get(`/devices/:deviceId/registrations/${passTypeIdentifier}`, (req, res) => {
  logger.debug('Get Devices');
  logger.debug(req.params);
  logger.debug(req.query);

  const passesUpdatedSince = parseInt(req.params.passesUpdatedSince || '0', 10);

  /* get all registrations for device */
  const registrations = _.filter(data.registrations, r => r.deviceId === req.params.deviceId);

  /* find all passes with serial number from registrations */
  /* that were updated afer passesUpdatedSince */
  let filteredPasses = [];
  _.forEach(registrations, (r) => {
    const filter = _.filter(data.passes, p => p.serialNumber === r.serialNumber
      && p.lastUpdated > passesUpdatedSince);
    filteredPasses = filteredPasses.concat(filter);
  });

  /* prepare and send back the response */
  const response = filteredPasses.length ? {
    lastUpdated: `${_.maxBy(filteredPasses, p => p.lastUpdated).lastUpdated}`,
    serialNumbers: _.map(filteredPasses, p => p.serialNumber)
  } : {
    lastUpdated: null,
    serialNumbers: []
  };

  logger.debug('****************************************************');
  logger.debug(response);
  logger.debug('****************************************************');

  res.status(200).json(response);
});

/* Validate fields */
const registerValidation = {
  body: {
    pushToken: Joi.string().required()
  }
};
/**
 * Registering a Device to Receive Push Notifications for a Pass.
 */
router.post(`/devices/:deviceId/registrations/${passTypeIdentifier}/:serialNumber`, validateToken, validate(registerValidation), (req, res) => {
  logger.debug('Register');
  logger.debug(req.body);
  logger.debug(req.params);

  /* find a pass for given serial number. fail if none is found */
  const pass = _.find(data.passes, p => p.serialNumber === req.params.serialNumber);
  if (!pass) {
    res.status(404).send(`Pass with serial number ${req.params.serialNumber} not found`);
    return;
  }

  const device = _.find(data.devices, dev => dev.deviceId === req.params.deviceId);
  if (!device) {
    data.devices.push({
      deviceId: req.params.deviceId,
      pushToken: req.body.pushToken
    });
  }

  const registration = _.find(data.registrations, reg => reg.deviceId === req.params.deviceId
    && reg.serialNumber === req.params.serialNumber);
  if (registration) { // exists
    res.status(200).end();
  } else { // doesn't exist
    data.registrations.push({
      deviceId: req.params.deviceId,
      serialNumber: req.params.serialNumber
    });

    logger.debug('****************************************************');
    logger.debug(data);
    logger.debug('****************************************************');

    res.status(201).end();
  }
});

/**
 * Unregistering a Device.
 */
router.delete(`/devices/:deviceId/registrations/${passTypeIdentifier}/:serialNumber`, validateToken, (req, res) => {
  logger.debug(`Delete: ${JSON.stringify(req.params)}`);

  /* remove device registration */
  _.remove(data.registrations, reg => reg.deviceId === req.params.deviceId
    && reg.serialNumber === req.params.serialNumber);

  /* if no more device with deviceId is registered remove device */
  const registrations = _.findIndex(data.registrations,
    reg => reg.deviceId === req.params.deviceId);
  if (registrations < 0) {
    _.remove(data.devices, dev => dev.deviceId === req.params.deviceId);
  }

  logger.debug('**************AFTER*DELETE**************************');
  logger.debug(data);
  logger.debug('****************************************************');

  res.status(200).end();
});

/**
 * Log from device.
 */
router.post('/log', (req, res) => {
  logger.info('**************LOGGING*******************************');
  logger.info(`Logging ${JSON.stringify(req.body)}`);
  logger.info('****************************************************');

  res.status(200).end();
});

/* Validation of fields */
const passValidation = {
  query: {
    id: Joi.string().required()
  }
};
/**
 * Get a new Pass. Must have a fixed id (change to db in the future??)
 */
router.get('/pass', validate(passValidation), (req, res, next) => {
  if (req.query.id !== 'c653357d-d30a-42b7-856e-abd625fc1af2') { // fixed item id
    res.status(404).json('Id not found in DB');
  } else {
    handlePass(res, req.query.id, data).catch(err => next(err));
  }
});

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
/*
 * Update pass fields and send Push Notification
 */
router.post('/update/:serialNumber', validateToken, validate(updateValidation), (req, res) => {
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
    console.log(">>>>>>>>" + device.pushToken);
  });
  if (tokens.length) {
    // const note = new apn.Notification({"aps" : {
    //   "alert" : {
    //       "title" : "711 Test",
    //       "body" : "test body here"
    //   }
      
    // }}); // always send an empty body
    let note = new apn.Notification();
    note.title = "test title";
    note.alert = "test alert 12345";
    note.payload = {'messageFrom': 'Dalsian'};
    note.body = "test body";

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
