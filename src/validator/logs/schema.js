const Joi = require('joi');
 
const LogSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { LogSchema };