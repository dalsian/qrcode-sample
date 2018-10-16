/* global appRoot */
/*
 * Copyright 2018 Topcoder Inc.
 */
const _ = require('lodash');
const path = require('path');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const config = require('config');

const { Template } = require('@destinationstransfers/passkit');

const logger = require('../common/logger');

/**
 * Create pass template. Load certificate and key files.
 */
const template = new Template('generic', {
  passTypeIdentifier: config.PASS_TYPE_IDENTIFIER,
  teamIdentifier: config.TEAM_ID,
  backgroundColor: '#4db856',
  labelColor: '#FFFFFF',
  foregroundColor: '#FFFFFF',
  organizationName: config.ORGANIZATION_NAME,
  webServiceURL: config.WEB_SERVICE_URL
});
template.keys(path.join(appRoot, config.KEYS_PATH), config.SECRET);
template.images.loadFromDirectory(path.join(appRoot, config.IMAGES_PATH));

/**
 * Will create a new Pass.
 *
 * @param {Object} res http response
 * @param {String} item the item indentifier
 * @param {Object} data memory datastore
 * @param {Object} template the pass template
 */
function handlePass(res, itemId, data) {
  const description = '7Rewards Award';
  const serialNumber = uuidv4();
  const formatVersion = 1;
  const expiration = moment().add(7, 'days');

  const pass = template.createPass({
    serialNumber,
    description,
    formatVersion,
    expirationDate: expiration.format('YYYY-MM-DDT00:00Z'),
    barcode: {
      format: 'PKBarcodeFormatPDF417',
      message: itemId,
      messageEncoding: 'utf-8'
    },
    associatedStoreIdentifiers: [config.APPID],
    authenticationToken: config.AUTHENTICATION_TOKEN
  });

  /* Pass Fields - This would have to come from Database Depending of the item's id */
  pass.headerFields.add({
    key: 'item-header',
    value: 'Redeem'
  });
  pass.primaryFields.add({
    key: 'item-name',
    label: 'Single Serve Chips',
    value: 'Frito Lays'
  });
  pass.secondaryFields.add({
    key: 'expiration-field',
    label: 'Expires',
    value: expiration.format('MM/DD/YYYY'),
    changeMessage: 'Congratulations, you have used your coupon'
  });
  pass.auxiliaryFields.add({
    key: 'aux-field',
    attributedValue: '<a href="https://itunes.apple.com/us/app/7-eleven-inc/id589653414?mt=8">Open the 7-Eleven 7Rewards App</a>',
    value: '7Rewards App',
    textAlignment: 'PKTextAlignmentCenter'
  });

  // save to memore datastore
  data.passes.push({
    serialNumber,
    pass,
    lastUpdated: moment().unix()
  });

  res.on('end', value => logger.info(`res end ${value}`));
  res.on('close', value => logger.info(`res close ${value}`));
  res.on('error', value => logger.info(`res error ${value}`));

  logger.debug('**************CREATED*PASS**************************');
  logger.debug(`New serial: ${serialNumber}`);
  logger.debug(`New length: ${data.passes.length}`);
  logger.debug('****************************************************');

  /* Send back to user */
  res.status(200);
  return pass.render(res).catch((e) => {
    _.remove(data.passes, p => p.serialNumber === serialNumber);
    throw e;
  });
}

module.exports = handlePass;
