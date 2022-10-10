class CollabsHandler {
  constructor(collabs, playlists, validator) {
    this._collabs = collabs;
    this._playlists = playlists;
    this._validator = validator;
    this.createCollab = this.createCollab.bind(this);
    this.deleteCollab = this.deleteCollab.bind(this);
  }

  async createCollab(r, h) {
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
  }

  async deleteCollab(r) {
    await this._validator.validateCollab(r.payload);
    await this._playlists.verifyPlaylist({id: r.payload.playlistId}, r.auth.credentials);

    await this._collabs.delete(r.payload, r.auth.credentials);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus.',
    };
  }
}

module.exports = CollabsHandler;
