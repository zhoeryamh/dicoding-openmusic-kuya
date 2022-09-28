const Joi = require('joi');
 
const PlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

const InsertSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSchema, InsertSchema };