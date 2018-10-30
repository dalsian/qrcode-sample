/**
 * This is the main service used by the APIs.  
 * Each function will need to interact with different services, 
 * like 7-reward-consumer, our DB, ...etc.
 */


/**
 * Module dependencies.
 */
var util = require('util');
var moment = require('moment');
var reward_consumer = require('../services/7-rewards-consumer');
var db_manager = require('../services/db-manager');

//TODO this should be either be dynamic or eliminated in future.
const username = "dev@t-3.com";
const password = "t3!creative";

//  Client token from 7-reward.
//  { "access_token": "HKBCKb************************",
//    "token_expire": moment object,
//    "scope": "write_profile read_config reset_password <...>",
//    "token_type": "Bearer"}
let reward_client_token = {}; 

/**
 * Retrieve existing 7-reward client token from memory.  If not exist
 * or expired, call 7-reward api to retrive a new one and store in memory.
 */
const getClientToken = async () => {

    if (!reward_client_token['token_expire'] ||
        (reward_client_token['token_expire'].diff(moment())  <= 0)) {

            const clientToken = await reward_consumer.getClientToken();
            const token = JSON.parse(clientToken);

            reward_client_token = {
                access_token: token.access_token,
                token_expire: (moment().add(token.expires_in, 's')),
                scope: token.scope,
                token_type: token.token_type
            };
    } 

    return reward_client_token;
};

const register = async (uid) => {
    //TODO generate unique username and password to each device.
    //TODO register user to 7-reward api.
    //  (1) Look for client token in memory, if expired, 
    //      call client authentication from 7-reward api.
    //  (2) Register new account using client token
    const response = await db_manager.addDevice(uid, username, password);
    return response;
};

/**
 * Retrieve token related to the device from db.
 * If token doesn't exist or expired, will call
 * authenticate() method and return the new token.
 * @param {*} uid 
 */
const getUserToken = async (uid) => {

    const tokenInfo = await db_manager.getUserTokenInfo(uid);
    let token = '';

    if (!token.access_token ||  //doesn't exist
        (moment(token.token_expire).diff(moment())  <= 0)) { //can refresh?

        const auth = await authenticate(uid);

        token = `${auth.token_type} ${auth.access_token}`;
        //TODO need to update token to db

    } else { //exists in db
        const tokenInfoObj = JSON.parse(tokenInfo);
        token = `${tokenInfoObj.token_type} ${tokenInfoObj.access_token}`;
    }

    return token;
};

/**
 * To retrieve user token for a specific device.  
 * (1) Will retrieve username and password related to the 
 *      device id.
 * (2) call 7-reward api's authenticate method to authenticate 
 *      as a preenrolled user.
 * @param {*} uid 
 */
const authenticate = async (uid) => {

    const credential = await db_manager.getCredentialByDeviceID(uid);
    const auth = await reward_consumer.authenticateUserByPassword(
                                    credential.username, credential.password);

    return JSON.parse(auth);
};

/**
 * Get rewards for a device.
 * (1) Retrieve device token.
 * (2) Retrieve reward.
 * !!! Note : device must already exist. 
 * @param {*} uid 
 */
const getRewards = async (uid) => {

    const token = await getUserToken(uid);
    console.log(">>>>>"+token);
    const userRewards = await reward_consumer.getUserRewards(token);

    return JSON.parse(userRewards);
};

/**
 * Get available reward_points.
 * (1) Retrieve device token.
 * (2) Retrieve points.
 * !!! Note : device must already exist. 
 * @param {*} uid 
 */
const getTotalRewardPoints = async (uid) => {

    const token = await getUserToken(uid);
    const userReward = await reward_consumer.getUserRewards(token);

    const points = {
        "reward_points": JSON.parse(userReward).rewards_points
    };

    return points;
};

module.exports = {
    "getClientToken": getClientToken,
    "register": register,
    "authenticate": authenticate,
    "getRewards": getRewards,
    "getTotalRewardPoints": getTotalRewardPoints
};