const https = require('https');
const querystring = require('querystring');
const util = require('util');
const logger = require('../common/logger');

const callHttps = (options, postData = {}) => {
    
    return new Promise((resolve, reject) => {

        // !!!!! WARNING !!!!!!! TEMPORARY. DO NOT USE THIS IN PRODUCTION ENVIRONMENT.
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

        const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
            res.setEncoding('utf8');
    
            res.on('data', (chunk) => {
                console.log(`httputil >>>>>> chunk >>> ${util.inspect(chunk)}`);
                resolve(chunk);
            });
            res.on('end', () => {
                console.log('http util response complete');
            });
        });
    
        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });
    
        // write data to request body
        req.write(postData);
        req.end();
    });
};

module.exports = {
    "callHttps": callHttps
};