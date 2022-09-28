const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async add(r, a) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, r.name, a.id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan.'); 
    return result.rows[0].id;
  }

  async get(a) {
    const query = {
      text: 'SELECT playlists.id, name, username FROM playlists JOIN users ON owner = users.id WHERE owner = $1',
      values: [a.id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ada.'); 

    return result.rows;
  }

  async delete(r, a) {
    await this.verifyPlaylist(r, a);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async verifyPlaylist(r, a) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ada.');
    
    const playlist = result.rows[0];
    if (playlist.owner !== a.id) throw new AuthorizationError('Tidak ada Hak Akses.');
  }

  async addSong(p, b, a) {
    console.log([p, b, a]);
    await this.verifySong(b);
    await this.verifyPlaylist(p, a);

    const id = `insert-${nanoid(16)}`;
    
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, p.id, b.songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Lagu gagal ditambahkan.'); 
  }

  async getSong(r, a) {
    await this.verifyPlaylist(r, a);

    const query = {
      text: 'SELECT playlists.id, name, username FROM playlists JOIN users ON owner = users.id WHERE playlists.id = $1',
      values: [r.id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ada.');
    
    const data = {
      text: 'SELECT songs.id, title, performer FROM playlist_songs JOIN songs ON song_id = songs.id WHERE playlist_id = $1',
      values: [r.id],
    };

    const songs = await this._pool.query(data);

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: songs.rows,
    };
  }

  async verifySong(r) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [r.songId],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Lagu tidak ada.');
  }
}

module.exports = PlaylistsService;