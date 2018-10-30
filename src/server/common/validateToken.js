/**
 * Module dependencies.
 */
const config = require('config');
const bcrypt = require('bcryptjs');

const logger = require('../common/logger');

/**
 * Check authorization token.
 *
 * @param {Object} req the http request
 * @param {Object} res the http response
 * @param {Function} next call the next function in chain
 */
function validateToken(req, res, next) {
  console.log("+++++ Validate Token");
  const authorization = req.get('Authorization');
  console.log("+++++ Auth " + authorization);
  if (authorization) {
    const token = authorization.split(' ')[1] || authorization.split(' ')[0];
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    bcrypt.compare(config.TOKEN_SECRET, decoded, (err, match) => {
      console.log(`Match ${match}`);//logger.info
      if (err) next({ status: 401, message: `Authorization: ${err}` });
      else if (!match) next({ status: 401, message: 'Authorization failure: auth token doesn\'t match' });
      else next();
    });
  } else {
      console.log('auth not found');
    next({ status: 401, message: `Authorization NOT found in header for ${req.url}` });
  }
};

module.exports = validateToken;