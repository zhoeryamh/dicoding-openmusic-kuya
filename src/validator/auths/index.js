const { AddAuthSchema, EditAuthSchema, DeleteAuthSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthsValidator = {
  validateAddAuth: (payload) => {
    const result = AddAuthSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateEditAuth: (payload) => {
    const result = EditAuthSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateDeleteAuth: (payload) => {
    const result = DeleteAuthSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = AuthsValidator;