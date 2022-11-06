const autoBind = require('auto-bind');
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    autoBind(this);
  }

  async createSong(r, h) {
    this._validator.validateSong(r.payload);
    const songId = await this._service.add(r.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan.',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async readSong(r) {
    const songs = await this._service.get(r.query);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async readSongById(r) {
    const song = await this._service.getById(r.params);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async updateSongById(r) {
    this._validator.validateSong(r.payload);
    await this._service.editById(r.params, r.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui.',
    };
  }

  async deleteSongById(r) {
    await this._service.delete(r.params);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus.',
    };
  }
}

module.exports = SongsHandler;
