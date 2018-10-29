/**
 * This service handles interactions with 7 Rewards API only.
 * Should not have additional logic related to wallet passes or 
 * our system.
 */


/**
 * Module dependencies.
 */
const httpUtil = require('../common/httpUtil');


/**
 * Config for 7-reward
 */
const url = "api-test.7-eleven.com";

const client_id_basic = "eEoAF2qXKzI2c0S9FfAb18ALV6hKnW7o";
const client_secret_basic = "UsZm6A7AA2sZsca5";

const client_id_user = "HcufmlDsAlLve4o5e68lWzLM6T9SiUvDRrLrV1B5";
const client_secret_user = "MIi6anADaucYMg8xIbAPXRPG3Sgt5mQRcko47qNQSll2tl" +
                            "WrrREIsvDtWr0MpKtl1PBeDFoatLuq4EfYTaEjhJk7hjkI" +
                            "GLWOwGHzPxZsIvUKMc3syHa9bj16873XzuGf";

/**
 * Request client token from 7-reward.  The client token is used for all
 * 7-reward user registrations.
 */
const getClientToken = () => {
    console.log(">>>>>> Client token");
    const postData = {
        "client_id": client_id_basic,
        "client_secret": client_secret_basic,
        "grant_type": "client_credentials"
    };
    const options = {
        hostname: url,
        port: 443,
        path: '/auth/token',
        method: 'POST'
    };

    return httpUtil.callHttps(options, postData);
};

/**
 * Make authenticate request to 7-reward using username and password
 * and retrieve temporary token.
 * @param {*} username 
 * @param {*} password 
 */
const authenticateUserByPassword = (username, password) => {
    console.log(">>>>>> Authenticate User");
    const postData = {
        "client_id": client_id_user,
        "client_secret": client_secret_user,
        "grant_type": "password",
        "username": username, 
        "password": password
    };
    const options = {
        hostname: url,
        port: 443,
        path: '/auth/token', //todo rf
        method: 'POST'
    };

    return httpUtil.callHttps(options, postData);
};

/**
 * Retrieve reward from user api.
 * @param {*} token 
 */
const getUserRewards = (token) => {
    const options = {
        hostname: url,
        port: 443,
        path: '/v4/rewards/me',
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    };
    
    return httpUtil.callHttps(options);
};

module.exports = {
    "getClientToken": getClientToken,
    "authenticateUserByPassword": authenticateUserByPassword,
    "getUserRewards": getUserRewards
};