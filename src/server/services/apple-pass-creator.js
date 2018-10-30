/**
 * Module dependencies.
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
      messageEncoding: 'utf-8',
      altText: 'Member ID : 1758773300048882179'
    },
    associatedStoreIdentifiers: [config.APPID],
    authenticationToken: config.AUTHENTICATION_TOKEN
  });

  /* Pass Fields - This would have to come from Database Depending of the item's id */
  pass.headerFields.add({
    key: 'item-product',
    label: 'Redeem Item',
    value: 'Big Gulp'
  });

  pass.primaryFields.add({
    key: 'item-point',
    label: 'Points',
    value: '800',
    textAlignment: 'PKTextAlignmentLeft'
  });
  
  pass.secondaryFields.add({
    key: 'item-message',
    label: 'Congratulations',
    value: 'you\'ve earned 800 rewards points',
    textAlignment: 'PKTextAlignmentLeft',
    changeMessage: 'Congraturation %@'
  });

  pass.auxiliaryFields.add({
    key: 'item-action',
    value: 'Scan barcode to redeem free drink',
    textAlignment: 'PKTextAlignmentLeft'
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

  console.log('**************CREATED*PASS**************************');
  console.log(`New serial: ${serialNumber}`);
  console.log(`New length: ${data.passes.length}`);
  console.log('****************************************************');

  /* Send back to user */
  res.status(200);
  return pass.render(res).catch((e) => {
    _.remove(data.passes, p => p.serialNumber === serialNumber);
    throw e;
  });
}

module.exports = handlePass;
