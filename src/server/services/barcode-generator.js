const bwipjs = require('bwip-js');
const fs = require('fs');
 
const generateBarcode = (_text, callback) => {
    bwipjs.toBuffer({
        bcid:        'pdf417',       // Barcode type
        text:        _text,    // Text to encode
        scale:       3,               // 3x scaling factor
        height:      10,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
    }, function (err, png) {
        //console.log(`${err} >>> ${png}`);
        if (err) {
            // Decide how to handle the error
            // `err` may be a string or Error object
            callback(err);
        } else {
            // `png` is a Buffer
            // png.length           : PNG file length
            // png.readUInt32BE(16) : PNG image width
            // png.readUInt32BE(20) : PNG image height
            console.log(">>>>"+png.toString('utf8'));
            var output = fs.createWriteStream(`src/server/images/bar.png`);
            output.write(png);
            callback(png.toString('base64'));
            // callback(png);
        }
        return;
    });
};

module.exports = {
    "generateBarcode": generateBarcode
};
