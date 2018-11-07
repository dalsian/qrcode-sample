/**
 * Module dependencies.
 */
const _ = require('lodash');
const path = require('path');
const config = require('config');
const apn = require('apn');
const moment = require('moment');
const util = require('util');

const data = require('../common/mock-data');
const logger = require('../common/logger');

/* create APN provider for push notifications */
const options = {
    cert: path.join(appRoot, config.KEYS_PATH, config.CERT_FILE),
    key: path.join(appRoot, config.KEYS_PATH, config.KEY_FILE),
    passphrase: config.PASSPHRASE,
    production: true
  };
const apnProvider = new apn.Provider(options);

const updatePass = async (_serialNumber, _body) => {
    logger.debug('>>>>>>Update');
    logger.debug(_serialNumber);
    logger.debug(_body);

    const foundPass = _.find(data.passes, p => p.serialNumber === _serialNumber);
    if (!foundPass) {
        return {status: 404, msg: `Pass with serial number ${req.params.serialNumber} not found`};
    }

    let updated = false;
    _.forEach(_body.update, (item) => {
        if (foundPass.pass[item.field]) {
        if (item.key) foundPass.pass[item.field].setValue(item.key, item.value);
        else foundPass.pass[item.field](item.value);
        updated = true;
        }
    });
    if (!updated) {
        return {status: 200, msg: 'Not updated'};
    }

    foundPass.lastUpdated = moment().unix();

    /* get all registrations for all devices associated with pass and send push */
    const registrations = _.filter(data.registrations,
        reg => reg.serialNumber === _serialNumber);
    const tokens = [];
    registrations.forEach((reg) => {
        const device = _.find(data.devices, dev => dev.deviceId === reg.deviceId);
        tokens.push(device.pushToken);
    });
    if (tokens.length) {
        const note = new apn.Notification({}); // always send an empty body
        console.log('Sending apn');
        return apnProvider.send(note, tokens);
    } else {
        return {status: 200, msg: "OK"};
    }
};

const updateAllPass = async (_body) => {
    logger.debug('>>>>>>Update All');
    logger.debug(_body);

    let updated = false;
    _.forEach(data.passes, (foundPass) => {
        _.forEach(_body.update, (item) => {
            if (foundPass.pass[item.field]) {
                if (item.key) foundPass.pass[item.field].setValue(item.key, item.value);
                else foundPass.pass[item.field](item.value);
                updated = true;
                foundPass.lastUpdated = moment().unix();
            }
        })
    });
    if (!updated) {
        return {status: 200, msg: 'Not updated'};
    }

    /* get all registrations for all devices associated with pass and send push */
    const registrations = data.registrations;
    const tokens = [];
    registrations.forEach((reg) => {
        const device = _.find(data.devices, dev => dev.deviceId === reg.deviceId);
        tokens.push(device.pushToken);
    });
    if (tokens.length) {
        const note = new apn.Notification({}); // always send an empty body
        console.log('Sending apn');
        return apnProvider.send(note, tokens);
    } else {
        return {status: 200, msg: "OK"};
    }
};

module.exports = {'updatePass' : updatePass, 'updateAllPass' : updateAllPass};

