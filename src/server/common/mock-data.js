/**
 * Memory datastore - change to MongoDB?? 
 */
const data = {
  devices: [],
  passes: [],
  registrations: [],
  stores: {}, //store dictionary
  reward_accounts: {} // surrogate account that relate device id to 7-reward credentials.
                     // sample document...
                     // reward_account(device_id, device_type, username, pasword, 
                     //              token: {token_type, access_token, token_expire})
};


/**
 * Initialize store dictonary.
 */
data.stores[1234] = {
  "id":1234,
  "address":"",
  "city":"Arlington",
  "zip":"78221",
  "lat":123.22,
  "long":352.99
};
data.stores[5678] = { 
  "id":5678,
  "address":"",
  "city":"Irving",
  "zip":"76889",
  "lat":113.22,
  "long":452.99
};
data.stores[1111] = {
  "id":1111,
  "address":"",
  "city":"Dallas",
  "zip":"78923",
  "lat":98.22,
  "long":232.99
};

module.exports = data;