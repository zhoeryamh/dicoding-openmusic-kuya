class AlbumHandler {
  constructor(album, storage, validator) {
    this._album = album;
    this._storage = storage;
    this._validator = validator;
    this.createAlbum = this.createAlbum.bind(this);
    this.readAlbum = this.readAlbum.bind(this);
    this.readAlbumById = this.readAlbumById.bind(this);
    this.updateAlbum = this.updateAlbum.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);
    this.uploadAlbumCover = this.uploadAlbumCover.bind(this);
  }

  async createAlbum(r, h) {
    this._validator.validateAlbum(r.payload);
    const albumId = await this._album.add(r.payload);

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
    const albums = await this._album.get();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async readAlbumById(r) {
    const album = await this._album.getById(r.params);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async updateAlbum(r) {
    this._validator.validateAlbum(r.payload);
    await this._album.editById(r.params, r.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbum(r) {
    await this._album.delete(r.params);

    return {
      status: 'success',
      message: 'Album berhasil dihapus.',
    };
  }

  async uploadAlbumCover(r, h) {
    const {cover} = r.payload;
    this._validator.validateAlbumCover(cover.hapi.headers);

    const filename = await this._storage.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/covers/${filename}`;
    await this._album.editCoverById(r.params, {url});

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
