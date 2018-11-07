/**
 * Module dependencies.
 */
const express = require('express');

const logger = require('../common/logger');
const router = express.Router();

/**
 * Log from device.
 */
router.post('/log', (req, res) => {
  logger.info('**************LOGGING*******************************');
  logger.info(`Logging ${JSON.stringify(req.body)}`);
  logger.info('****************************************************');

  res.status(200).end();
});

module.exports = router;
