const { LogSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const LogsValidator = {
  validateLog: (payload) => {
    const result = LogSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = LogsValidator;