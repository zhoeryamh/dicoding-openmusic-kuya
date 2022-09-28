const { PlaylistSchema, InsertSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylist: (payload) => {
    const result = PlaylistSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateInsert: (payload) => {
    const result = InsertSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = PlaylistsValidator;