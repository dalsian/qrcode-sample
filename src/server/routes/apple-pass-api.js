/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');
const Joi = require('joi');
const config = require('config');
const moment = require('moment');
const express = require('express');
const validate = require('express-validation');

const data = require('../common/mock-data');
const logger = require('../common/logger');
const validateToken = require('../common/validateToken');
const validationPattern = require('../common/validationPattern');
const handlePass = require('../services/apple-pass-creator');
const reward_service = require('../services/reward-service');

const router = express.Router();

// Reference of implementation
// https://developer.apple.com/library/archive/documentation/PassKit/Reference/PassKit_WebService/WebService.html
// https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Updating.html#//apple_ref/doc/uid/TP40012195-CH5-SW1

// Pass identifier
const passTypeIdentifier = config.PASS_TYPE_IDENTIFIER;

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

    //TODO update pass with correct reward points.


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

/**
 * Registering a Device to Receive Push Notifications for a Pass.
 */
router.post(`/devices/:deviceId/registrations/${passTypeIdentifier}/:serialNumber`, validateToken, validate(validationPattern.appleRegisterValidation), (req, res) => {
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

    /**
     * Register new user to reward service if the device is new.
     */
    if (!device) {
      reward_service.register(req.params.serialNumber)
                    .then((msg) => {
                        res.status(200).json(msg);
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
    }

    /**
     * TODO Call 7-rewards-consumer.  
     * Give initial reward points here.
     */

    /**
     * TODO Update barcode?
     */
    

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
 * Get a new Pass. Must have a fixed id (change to db in the future??)
 */
router.get('/pass', validate(validationPattern.appleGetPassValidation), (req, res, next) => {
  if (req.query.id !== 'c653357d-d30a-42b7-856e-abd625fc1af2') { // fixed item id
    res.status(404).json('Id not found in DB');
  } else {
    handlePass(res, req.query.id, data).catch(err => next(err));
  }
});

module.exports = router;
