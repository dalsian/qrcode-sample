/**
 * Configure the logger.
 */
const config = require('config');
const winston = require('winston');
const JSOG = require('jsog');

const MESSAGE = Symbol.for('message');

const jsogFormatter = (logEntry) => {
  const returnEntry = logEntry;
  returnEntry[MESSAGE] = JSOG.stringify(logEntry);
  return returnEntry;
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: config.LOG_LEVEL,
    format: winston.format(jsogFormatter)()
  }));
}

module.exports = logger;
