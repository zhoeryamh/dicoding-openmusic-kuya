const autoBind = require('auto-bind');
class AuthsHandler {
  constructor(auths, users, token, validator) {
    this._auths = auths;
    this._users = users;
    this._token = token;
    this._validator = validator;
    
    autoBind(this);
  }

  async createAuth(r, h) {
    this._validator.validateAddAuth(r.payload);
    const id = await this._users.verifyCredential(r.payload);

    const accessToken = this._token.generateAccess({ id });
    const refreshToken = this._token.generateRefresh({ id });
    
    await this._auths.add(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Auth berhasil ditambahkan.',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async updateAuth(r) {
    this._validator.validateEditAuth(r.payload);

    const { refreshToken } = r.payload;
    await this._auths.verify(refreshToken);

    const { id } = this._token.verifyRefresh(refreshToken);
    const accessToken = this._token.generateAccess({ id });

    return {
      status: 'success',
      message: 'Token berhasil diperbarui.',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuth(r) {
    this._validator.validateDeleteAuth(r.payload);

    const { refreshToken } = r.payload;
    await this._auths.verify(refreshToken);
    await this._auths.delete(refreshToken);

    return {
      status: 'success',
      message: 'Token berhasil dihapus.',
    };
  }
}

module.exports = AuthsHandler;
