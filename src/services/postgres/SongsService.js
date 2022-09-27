const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const _ = require('lodash');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSong } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async add(r) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, r.title, r.year, r.genre, r.performer, r.duration, r.albumId, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Lagu gagal ditambahkan'); 
    return result.rows[0].id;
  }

  async get(q) {
    const query = await this._pool.query("SELECT id, title, performer FROM songs");
    let result = query.rows;

    if ('title' in q) result = _.filter(result, (r) => r.title.toLowerCase().includes(q.title));
    if ('performer' in q)  result = _.filter(result, (r) => r.performer.toLowerCase().includes(q.performer));

    return result;
  }

  async getById(r) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [r.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan'); 
    return result.rows.map(mapSong)[0];
  }

  async editById(params, payload) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8',
      values: [payload.title, payload.year, payload.genre, payload.performer, payload.duration, payload.albumId, updatedAt, params.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
  }

  async delete(r) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = SongsService;