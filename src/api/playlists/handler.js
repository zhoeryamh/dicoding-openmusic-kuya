const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.createPlaylist = this.createPlaylist.bind(this);
    this.readPlaylist = this.readPlaylist.bind(this);
    this.deletePlaylistById = this.deletePlaylistById.bind(this);
    this.insertSong = this.insertSong.bind(this);
    this.readSong = this.readSong.bind(this);
  }

  async createPlaylist(r, h) {
    try {
      this._validator.validatePlaylist(r.payload);
      const playlistId = await this._service.add(r.payload, r.auth.credentials);

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
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

  async readPlaylist(r) {
    const playlists = await this._service.get(r.auth.credentials);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistById(r, h) {
    try {
      await this._service.delete(r.params, r.auth.credentials);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

  async insertSong(r, h) {
    try {
      this._validator.validateInsert(r.payload);
      await this._service.addSong(r.params, r.payload, r.auth.credentials);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
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

  async readSong(r) {
    const playlist = await this._service.getSong(r.params, r.auth.credentials);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }
}

module.exports = PlaylistsHandler;
