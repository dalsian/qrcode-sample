const https = require('https');
const http = require('http');
const querystring = require('querystring');
const util = require('util');
const logger = require('../common/logger');

const callHttps = (options, postData) => {
    
    return new Promise((resolve, reject) => {

        // const postDataStr = querystring.stringify(postData);

        // Add option headers for POST method
        // if (postDataStr.length > 2) {
        //     options['headers'] = {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Content-Length': Buffer.byteLength(postDataStr)
        //     };
        //     // console.log(`+++${util.inspect(options,{showHidden:false,depth:null})}`);
        // }

        /**
         * !!!!! WARNING !!!!!!!
         * TEMPORARY. DO NOT USE THIS IN PRODUCTION ENVIRONMENT.
         */
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
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
};

const callHttp = (options, postData = {}) => {
    
    return new Promise((resolve, reject) => {

        // const postDataStr = querystring.stringify(postData);

        // // Add option headers for POST method
        // if (postDataStr.length > 2) {
        //     options['headers'] = {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Content-Length': Buffer.byteLength(postDataStr)
        //     };
        //     // console.log(`+++${util.inspect(options,{showHidden:false,depth:null})}`);
        // }

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
            res.setEncoding('utf8');
    
            res.on('data', (chunk) => {
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
        req.write(querystring.stringify(postData));
        req.end();
    });
};


module.exports = {
    "callHttp": callHttp,
    "callHttps": callHttps
};