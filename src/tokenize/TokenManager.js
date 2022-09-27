const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccess: (p) => Jwt.token.generate(p, process.env.ACCESS_TOKEN_KEY),
  generateRefresh: (p) => Jwt.token.generate(p, process.env.REFRESH_TOKEN_KEY),
  verifyRefresh: (t) => {
    try {
      const artifacts = Jwt.token.decode(t);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      return artifacts.decoded;
    } catch (error) {
      throw new InvariantError('Token tidak valid.');
    }
  },
};

module.exports = TokenManager;