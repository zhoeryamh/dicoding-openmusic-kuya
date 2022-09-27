const Joi = require('joi');
 
const AddAuthSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const EditAuthSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
 
const DeleteAuthSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { AddAuthSchema, EditAuthSchema, DeleteAuthSchema };