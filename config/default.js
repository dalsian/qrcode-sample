/**
 * The default configuration.
 */
module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  /**
   * Pass type identifier registered in Apple Developer Portal.
   */
  PASS_TYPE_IDENTIFIER: process.env.PASS_TYPE_IDENTIFIER || 'pass.com.seven-eleven.qrcode',

  /**
   * Location where the Passkit library will look for the pem key.
   * Relative to the project folder.
   */
  KEYS_PATH: process.env.KEYS_PATH || 'keys',

  /**
   * Secret for private key needed by the Passkit library
   */
  SECRET: process.env.SECRET || 'seveneleven',

  /**
   * Location where the Passkit library will look for the template images.
   * Relative to the project folder.
   */
  IMAGES_PATH: process.env.IMAGES_PATH || 'images',

  /**
   * Certificate file used by the APN libray.
   */
  CERT_FILE: process.env.CERT_FILE || 'pass.apn-cer.pem',

  /**
   * Private key file used by the APN libray.
   */
  KEY_FILE: process.env.KEY_FILE || 'pass.apn-key.pem',

  /**
   * Passphrase used with key file to make calls to the APN library.
   */
  PASSPHRASE: process.env.PASSPHRASE || 'seveneleven',

  /**
   * Secret used to generate the authentication token.
   */
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'seveneleven',

  /**
   * Apple developer account Team Id.
   */
  TEAM_ID: process.env.TEAM_ID || 'C33ZSUHNMC',

  /**
   * An organization nane.
   */
  ORGANIZATION_NAME: process.env.ORGANIZATION_NAME || 'TC 7 Eleven',

  /**
   * External URL of the server (were this code is going to be deployed).
   */
  WEB_SERVICE_URL: process.env.WEB_SERVICE_URL || 'https://qrcode-demo.herokuapp.com',

  /**
   * Authentication token to verify the authenticity of the Pass.
   */
  AUTHENTICATION_TOKEN: process.env.AUTHENTICATION_TOKEN || 'JDJ5JDEyJGo2RlBadzBORzZsbFNXYk11SU9mVHVkVWRzOWtBa0h5aC8ycHF3V1lhMTVybkxNdy5QQVY2',

  /**
   * 7-Eleven's iTunes store identifier.
   */
  APPID: 589653414,

};
