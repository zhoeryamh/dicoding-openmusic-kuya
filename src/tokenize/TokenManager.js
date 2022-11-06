const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const { config } = require('../utils/index.js');

const TokenManager = {
  generateAccess: (p) => Jwt.token.generate(p, config.token.key),
  generateRefresh: (p) => Jwt.token.generate(p, config.token.refresh),
  verifyRefresh: (t) => {
    try {
      const artifacts = Jwt.token.decode(t);
      Jwt.token.verifySignature(artifacts, config.token.refresh);
      return artifacts.decoded;
    } catch (error) {
      throw new InvariantError('Token tidak valid.');
    }
  },
};

module.exports = TokenManager;