const Joi = require('joi');
 
const AlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().max(new Date().getFullYear()).integer().required(),
});

module.exports = { AlbumSchema };