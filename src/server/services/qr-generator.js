var qr = require('qr-image')
var fs = require('fs');

const generateQR = (base_url, storeid, format, 
                    additional = {} //additional info passed in request body
                    ) => {

    let url = base_url + `?storeid=${storeid}`;

    for(let key in additional) {
        url += `&${key}=${additional[key]}`;
    }
    url.substr(0, url.length-1);

    var code = qr.image(url, { type: format });
    
    //Save QR image to server directory
    var output = fs.createWriteStream(`src/server/images/QR_${storeid}.${format}`);
    code.pipe(output);
    
    return code;
}

module.exports = {'generateQR' : generateQR};