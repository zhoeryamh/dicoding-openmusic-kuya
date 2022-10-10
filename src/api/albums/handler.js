class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.createAlbum = this.createAlbum.bind(this);
    this.readAlbum = this.readAlbum.bind(this);
    this.readAlbumById = this.readAlbumById.bind(this);
    this.updateAlbum = this.updateAlbum.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
  }

  async createAlbum(r, h) {
    this._validator.validateAlbum(r.payload);
    const albumId = await this._service.add(r.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan.',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async readAlbum() {
    const albums = await this._service.get();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async readAlbumById(r) {
    const album = await this._service.getById(r.params);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async updateAlbum(r) {
    this._validator.validateAlbum(r.payload);
    await this._service.editById(r.params, r.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbum(r) {
    await this._service.delete(r.params);

    return {
      status: 'success',
      message: 'Album berhasil dihapus.',
    };
  }
}

module.exports = AlbumHandler;
