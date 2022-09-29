const ClientError = require('../../exceptions/ClientError');

class AuthsHandler {
  constructor(auths, users, token, validator) {
    this._auths = auths;
    this._users = users;
    this._token = token;
    this._validator = validator;
    this.createAuth = this.createAuth.bind(this);
    this.updateAuth = this.updateAuth.bind(this);
    this.deleteAuth = this.deleteAuth.bind(this);
  }

  async createAuth(r, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Kegagalan dari Server.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async updateAuth(r, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Kegagalan dari Server.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAuth(r, h) {
    try {
      this._validator.validateDeleteAuth(r.payload);
 
      const { refreshToken } = r.payload;
      await this._auths.verify(refreshToken);
      await this._auths.delete(refreshToken);
 
      return {
        status: 'success',
        message: 'Token berhasil dihapus.',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      
      const response = h.response({
        status: 'error',
        message: 'Kegagalan dari Server.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AuthsHandler;
