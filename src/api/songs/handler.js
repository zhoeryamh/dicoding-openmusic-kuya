const _ = require('lodash');
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload;
      const songId = this._service.addSong({
        title, year, genre, performer, duration, albumId,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
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

  getSongsHandler() {
    const songs = this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs: songs.map((value) => _.pick(value, ['id', 'title', 'performer'])),
      },
    };
  }

  getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
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

  putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
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

  deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
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

module.exports = SongsHandler;
