const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class PlaylistsService {
  constructor(collabService, logService) {
    this._pool = new Pool();
    this._collab = collabService;
    this._log = logService;
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
      text: 'SELECT playlists.id, name, username FROM playlists JOIN users ON users.id = owner LEFT JOIN collaborations ON "playlistId" = playlists.id WHERE owner = $1 OR "userId" = $1',
      values: [a.id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async delete(r, a) {
    await this.verifyPlaylist(r, a);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan.');
  }

  async verifyPlaylist(r, a) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ada.');
    
    const playlist = result.rows[0];
    if (playlist.owner !== a.id) throw new AuthorizationError('Hak Akses playlist tidak ada.');
  }

  async addSong(p, b, a) {
    await this.verifySong(b);
    await this.verifyAccess(p, a);

    const id = `insert-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, p.id, b.songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Lagu gagal ditambahkan.'); 

    await this._log.add({playlistId: p.id, songId: b.songId, userId: a.id, action: 'add', time: time});
  }

  async getSong(r, a) {
    await this.verifyAccess(r, a);
    const query = {
      text: 'SELECT playlists.id, name, username FROM playlists JOIN users ON owner = users.id WHERE playlists.id = $1',
      values: [r.id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ada.');
    
    const data = {
      text: 'SELECT songs.id, title, performer FROM playlist_songs JOIN songs ON "songId" = songs.id WHERE "playlistId" = $1',
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

  async deleteSong(p, b, a) {
    await this.verifySong(b);
    await this.verifyAccess(p, a);

    const time = new Date().toISOString();
    
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "songId" = $1',
      values: [b.songId],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan.');

    await this._log.add({playlistId: p.id, songId: b.songId, userId: a.id, action: 'delete', time: time});
  }

  async verifySong(r) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [r.songId],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Lagu tidak ada.');
  }

  async verifyAccess(r, a) {
    try {
      await this.verifyPlaylist(r, a);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collab.verify({playlistId: r.id, userId: a.id});
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;