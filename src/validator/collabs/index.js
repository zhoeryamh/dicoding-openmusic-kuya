const { CollabSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollabsValidator = {
  validateCollab: (payload) => {
    const result = CollabSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CollabsValidator;