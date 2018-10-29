/**
 * Will connect to mongo DB later.
 */

/**
 * Module dependencies.
 */
var util = require('util');
var reward_accounts = require('../common/mock-data').reward_accounts;

/**
 * Get credential if device already exists. 
 * The credential will be used to authenticate 7-reward api.
 * Should return {userid: id, password: password}
 * @param {*} deviceId 
 */
const getCredentialByDeviceID = (deviceId) => {
    return new Promise((resolve, reject) => {
        const account = reward_accounts[deviceId];
        if (account) {
            resolve(
                {
                    username: account.username,
                    password: account.password
                }
            );
        } else {
            reject({err: "device does not exist"});
        }
    });
};

/**
 * Create a new record in reward_account.
 * TODO need to associate with wallet pass.
 * @param {*} _deviceId 
 * @param {*} _username 
 * @param {*} _password 
 */
const addDevice = (_deviceId, _username, _password) => {
    return new Promise((resolve, reject) => {
        if (reward_accounts[_deviceId]) {
            reject({err: `Device ${_deviceId} already exists`});
        } else {
            reward_accounts[_deviceId] = {
                deviceId: _deviceId,
                username: _username,
                password: _password
            };
            resolve({msg: `Device ${_deviceId} registered`});
        }
    });
};

/**
 * Get {token_type, access_token, token_expire} object
 * from reward_account document.
 * @param {*} deviceId 
 */
const getUserTokenInfo = (deviceId) => {
    return new Promise((resolve, reject) => {
        const account = reward_accounts[deviceId];
        if (!account) {
            reject({err: "Device doesn't exist"});
        }
        const token = account.token;
        if (!token) {
            resolve({}); //Not authorized yet
        } else {
            resolve(token);
        }
    });
};

module.exports = {
    "getCredentialByDeviceID": getCredentialByDeviceID,
    "addDevice": addDevice,
    "getUserTokenInfo": getUserTokenInfo
};