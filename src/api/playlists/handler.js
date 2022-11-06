const autoBind = require('auto-bind');
class PlaylistsHandler {
  constructor(service, log, validator) {
    this._service = service;
    this._log = log;
    this._validator = validator;
    
    autoBind(this);
  }

  async createPlaylist(r, h) {
    this._validator.validatePlaylist(r.payload);
    const playlistId = await this._service.add(r.payload, r.auth.credentials);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan.',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
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

  async deletePlaylistById(r) {
    await this._service.delete(r.params, r.auth.credentials);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    };
  }

  async insertSong(r, h) {
    this._validator.validateSong(r.payload);
    await this._service.addSong(r.params, r.payload, r.auth.credentials);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan.',
    });
    response.code(201);
    return response;
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

  async deleteSongById(r) {
    this._validator.validateSong(r.payload);
    await this._service.deleteSong(r.params, r.payload, r.auth.credentials);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus.',
    };
  }

  async readLog(r) {
    await this._service.verifyAccess(r.params, r.auth.credentials);

    const activities = await this._log.get(r.params);
    return {
      status: 'success',
      data: {
        playlistId: r.params.id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
