const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class LogsService {
  constructor() {
    this._pool = new Pool();
  }

  async add(r) {
    const id = `activities-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, r.playlistId, r.songId, r.userId, r.action, r.time],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Aktifitas gagal ditambahkan.'); 
    return result.rows[0].id;
  }

  async get(r) {
    const query = {
      text: 'SELECT users.username, title, action, time FROM playlist_song_activities JOIN users ON users.id = "userId" JOIN songs ON songs.id = "songId" WHERE "playlistId" = $1',
      values: [r.id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Aktifitas tidak ada.'); 

    return result.rows;
  }
}

module.exports = LogsService;