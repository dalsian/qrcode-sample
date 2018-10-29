/**
 * Temporary endpoints for testing.
 */


/**
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var reward_service = require('../services/reward-service');
var barcode_generator = require('../services/barcode-generator');

/**
 * Base64 string should be used in the following way...
 * <img src='data:image/png;base64,{base64string}' />
 */
router.get("/test/barcode/:data", (req, res) => {
    barcode_generator.generateBarcode(req.params.data, (buffer) => {
        res.send(buffer);
    });
});


 /**
  * Authenticate with 7-reward api to 
  * get a temporary token.
  * Currently using user id and password provided for testing.
  * 
  * @param deviceId - unique device id
  */
router.get("/test/:deviceId/auth", (req, res) => {
    reward_service.authenticate(req.params.deviceId)
                    .then((msg) => { 
                        res.json(msg);
                    })
                    .catch((err) => {
                        res.status(500).json(err);
                    });
});

// /**
//  * Use token returned from /test/auth to get reward object
//  * e.g 
//  * http://localhost:3030/v1/test/user/rewards
//  * in request header
//  * authorization : {token_type} {access_token}
//  */
// router.get("/test/user/rewards", (req, res) => {
//     // console.log(util.inspect(req.headers, {showHidden:false, depth:null}));
//     reward_service.getRewards(req.headers.authorization)
//                 .then((reward) => {
//                     res.json(reward);
//                 })
//                 .catch((err) => {
//                     res.status(500).json(err);
//                 });
// });

// /**
//  * Returns total points for this device.
//  */
// router.get("/test/user/points", (req, res) => {
//     reward_service.getTotalRewardPoints(req.headers.authorization)
//                     .then((points) => {
//                         // res.json(JSON.parse(points));
//                         res.json(points);
//                     })
//                     .catch((err) => {
//                         res.status(500).json(err);
//                     });
// });

module.exports = router;
