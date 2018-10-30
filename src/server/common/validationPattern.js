/**
 * Module dependencies.
 */
const Joi = require('joi');

/* Validate fields */
const STRUCTURE_FIELDS = [
  'auxiliaryFields',
  'backFields',
  'headerFields',
  'primaryFields',
  'secondaryFields'
];
const updateObject = Joi.object().keys({
  field: Joi.string().required(),
  key: Joi.string().when('field', { is: Joi.any().valid(STRUCTURE_FIELDS), then: Joi.required() }),
  value: Joi.any().required()
});
const appleNotificationValidation = {
  body: {
    update: Joi.array().items(updateObject).required()
  }
};

/* Validate fields */
const appleRegisterValidation = {
  body: {
    pushToken: Joi.string().required()
  }
};

/* Validate fields */
const appleGetPassValidation = {
  query: {
    id: Joi.string().required()
  }
};

module.exports = {
  appleNotificationValidation: appleNotificationValidation,
  appleRegisterValidation: appleRegisterValidation,
  appleGetPassValidation: appleGetPassValidation
};