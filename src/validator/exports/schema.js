const Joi = require('joi');
 
const ExportAlbumsSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
 
module.exports = ExportAlbumsSchema;