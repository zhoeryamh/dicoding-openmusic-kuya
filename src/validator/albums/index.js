const { AlbumSchema, AlbumCoverSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbum: (payload) => {
    const result = AlbumSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateAlbumCover: (payload) => {
    const result = AlbumCoverSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = AlbumsValidator;