# Introduction

Wallet Passkit node.js server.

The code implements the required endpoints defined in https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Updating.html#//apple_ref/doc/uid/TP40012195-CH5-SW1.

The server also implements two other endpoints as defined in Swagger file found in `docs/` folder necessary to create Pass for user and generate update the Pass.

# Setup

In order to use the application you will need some keys generated using the Apple's developer account.

The first set is to allow creating Wallet Passes. The second is for sending push notifications using APN services.

To start with, you'll need a certificate issued by [the iOS Provisioning Portal](https://developer.apple.com/ios/manage/passtypeids/index.action). You need one certificate per Pass Type Identifier.

Also, before running the application all configurable variables must be set.

## Environment variables

1. `PASS_TYPE_IDENTIFIER`: Pass type identifier registered in Apple Developer Portal.
2. `KEYS_PATH`: Location where the Passkit library will look for the pem key. Relative to the project folder.
3. `SECRET`: Secret for private key needed by the Passkit library.
4. `IMAGES_PATH`: Location where the Passkit library will look for the template images. Relative to the project folder.
5. `CERT_FILE`: Certificate file used by the APN libray.
6. `KEY_FILE`: Private key file used by the APN libray.
7. `PASSPHRASE`: Passphrase used with key file to make calls to the APN library.
8. `TOKEN_SECRET`: Secret used to generate the authentication token.
9. `TEAM_ID`: Apple developer account Team Id.
10. `ORGANIZATION_NAME`: An organization nane.
11. `WEB_SERVICE_URL`: External URL of the server (were this code is going to be deployed).
12. `AUTHENTICATION_TOKEN`: Authentication token to verify the authenticity of the Pass.
13. `APPID`: 7-Eleven's iTunes store identifier

## Get certificates for Passkit

After adding the certificate to your Keychain, you need to export it as a `.p12` file and copy it into the keys directory.

You will also need the [Apple Worldwide Developer Relations Certification
Authority](https://www.apple.com/certificateauthority/) certificate and to convert the `.p12` files into `.pem` files.  You
can do both using the `passkit-keys` command:

```sh
$ ./node_modules/\@destinationstransfers/passkit/bin/passkit-keys ./pathToKeysFolder
```

Real example. 

1. Pass type identifier equals to `pass.com.seveneleven`. 
2. Exported certificate must be called `com.seveneleven.cert`.
3. Converted key file called `com.seveneleven.p12`. 
4. Keys folder is `keys`. 

During the process below the `.p12` key password and a passphrase will be necessary.

```sh
$ ./node_modules/\@destinationstransfers/passkit/bin/passkit-keys ./keys
```

This will generate the files `wwdr.pem` and `com.seveneleven.pem`.

## Get the certificates for APN library

Using the certificate and converted key of the step above, run the following commands to get the certificate and private key in the format needed for APN.

```sh
$ openssl x509 -in com.seveneleven.cer -inform DER -outform PEM -out com.seveneleven.apn.pem
$ openssl pkcs12 -in com.seveneleven.apn.p12 -out com.seveneleven.apn.pem -nodes
```

You will be prompt for the `.p12` key password and passphrase for the new private key. It can either be the same or different from the one used for Passkit.

## Saving the keys securely

During development you might want to deploy to a temporary server like Heroku. It's a good idea to zip all certificates and private keys and place using zip encryption and password. Name the file keys.zip and place it in the root of the source. Name it `keys.zip`. The file can be put in Git repository since it's encrypted.

To use it set the environment variable `ZIP_PASSWORD` before running `npm i`.

# Usage

I- Local usage:

Local usage is not really possible because the Wallet Pass cannot communicate using plain HTTP. However, using swagger you can verifiy the API.

Set all the environment variables described above and run:

```sh
$ npm install
$ npm start
```

II- To deploy in heroku:

1. Create application: `heroku apps:create <name>`
2. Push code to heroku: `git push heroku master`

III- Create QR code

Create QR code with the webservice URL and the item id `https://<name>.herokuapp.com/#c653357d-d30a-42b7-856e-abd625fc1af2`. 

In `docs/` folder there is alreday a QR code created with the following URL: `https://tc-wallet-demo.herokuapp.com/#c653357d-d30a-42b7-856e-abd625fc1af2`.

If are deploying to another platform the QR code would be `https://{{SERVER_URL}}/#c653357d-d30a-42b7-856e-abd625fc1af2`.

Link shortenning can be used.

## Test Workflow

1. User scans a QR code using an iPhone camera
2. QR code is recognized and user is prompted with a link to claim their reward
3. User clicks on the link, and a static HTML page will load in Safari
4. User clicks on the “Add to Apple Wallet” button
5. iOS then opens the screen to add the reward to their wallet
6. Reward is then added to the users wallet
7. User then opens their wallet
8. On the passcard within the wallet, there should be a link to open the 7-Eleven app in the Apple App Store.

PoC application can send push notifications to the devices to inform the user that the reward has been changed. For that the `/v1/update` endpoint defined in swagger must be used. Please see below.

## Push Notifications Verification

After adding the Pass to the Wallet of a device, the pass information can be updated. The instruction below shows how to do that.

First, open the site http://editor.swagger.io/, and Copy and Paste the contents of the swagger file found [here](docs/swagger-webservice.yaml) into the left pane overwriting the existing code.

Change the URL to the correct webservices URL on the left pane in the property `host`.

On the right pane do:

1. click the authorize button and enther the string `ApplePass <AuthenticationToken>`.
2. Find the endpoint `/{version}/update/{serialNumber}`. Expand the item.
3. Click the button `Try it out`. 
4. For the `update` parameter enter the value below.

```json
{
  "update": [
    {
      "field": "secondaryFields",
      "key": "expiration-field",
      "value": "Expired"
    }
  ]
}
```

5. Click the button `Execute`.

Another example for update:

```json
{
  "update": [
    {
      "field": "voided",
      "value": "true"
    }
  ]
}
```



