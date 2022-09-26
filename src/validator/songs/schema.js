const Joi = require('joi');
 
const SongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().max(new Date().getFullYear()).integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { SongSchema };