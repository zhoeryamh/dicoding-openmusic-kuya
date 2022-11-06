class ExportsHandler {
  constructor(exports, playlists, validator) {
    this._exports = exports;
    this._playlists = playlists;
    this._validator = validator;
 
    this.exportPlaylist = this.exportPlaylist.bind(this);
  }
 
  async exportPlaylist(r, h) {
    this._validator.validateExportAlbums(r.payload);

    const { playlistId } = r.params;
    await this._playlists.verifyAccess({ id: playlistId }, r.auth.credentials);

    const message = {
      playlistId,
      targetEmail: r.payload.targetEmail,
    };

    await this._exports.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}
 
module.exports = ExportsHandler;