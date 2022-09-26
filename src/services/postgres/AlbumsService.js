const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbum } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async add(r) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, r.name, r.year, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id)  throw new InvariantError('Album gagal ditambahkan');
    return result.rows[0].id;
  }

  async get() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapAlbum);
  }

  async getById(r) {
    const getAlbum = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [r.id],
    };

    const getSong = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [r.id],
    };

    const albums = await this._pool.query(getAlbum);
    const songs = await this._pool.query(getSong);

    if (!albums.rowCount) throw new NotFoundError('Album tidak ditemukan');

    return {
      id: albums.rows[0].id,
      name: albums.rows[0].name,
      year: albums.rows[0].year,
      songs: songs.rows
    };
  }

  async editById(params, payload) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET "name" = $1, "year" = $2, "updated_at" = $3 WHERE id = $4 RETURNING id',
      values: [payload.name, payload.year, updatedAt, params.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)  throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async delete(r) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;