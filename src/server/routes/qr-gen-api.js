var express = require('express');
var util = require('util');
var stores = require('../common/mock-data').stores;
var qr_generator = require('../services/qr-generator');
var router = express.Router();

const base_url = "https://qrcode-demo-test.herokuapp.com";

/**
 * This will generate QR code and 
 * (1) Save it in image directory
 * (2) Return base64 encoded image string (to dynamically display after ajax call)
 */
router.post('/qr/generate', (req, res) => {
    console.log(`${util.inspect(req.body, {showHidden:false, dept:null})}`);
    const format = req.body.format;
    const storeid = req.body.storeid;
    const store = stores[parseInt(storeid)];

    if (!store) {
        res.send('Store not found.');
        return;
    }

    delete req.body.format;
    delete req.body.storeid;

    let additional = Object.assign(
                        {
                            lat: store.lat,
                            long: store.long,
                        }, 
                        req.body);

    let code = qr_generator.generateQR(base_url, storeid, format, additional);

    const chunks = [];

    code.on("data", function (chunk) {
        chunks.push(chunk);
    });

    code.on("end", function () {
        res.send(Buffer.concat(chunks).toString('base64'));
    });
});

module.exports = router;