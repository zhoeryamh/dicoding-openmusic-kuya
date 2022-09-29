const ClientError = require('../../exceptions/ClientError');

class CollabsHandler {
  constructor(collabs, playlists, validator) {
    this._collabs = collabs;
    this._playlists = playlists;
    this._validator = validator;
    this.createCollab = this.createCollab.bind(this);
    this.deleteCollab = this.deleteCollab.bind(this);
  }

  async createCollab(r, h) {
    try {
      this._validator.validateCollab(r.payload);
      await this._playlists.verifyAccess({id: r.payload.playlistId}, r.auth.credentials);
      const collaborationId = await this._collabs.add(r.payload, r.auth.credentials);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan.',
        data: {
          collaborationId,
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

  async deleteCollab(r, h) {
    try {
      this._validator.validateCollab(r.payload);
      this._playlists.verifyAccess(r.payload);

      await this._collabs.delete(r.payload, r.auth.credentials);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus.',
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

module.exports = CollabsHandler;
