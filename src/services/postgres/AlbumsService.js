const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapAlbum } = require('../../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cache = cacheService;
  }

  async add(r) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, r.name, r.year, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id)  throw new InvariantError('Album gagal ditambahkan.');
    return result.rows[0].id;
  }

  async get() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapAlbum);
  }

  async getById(r) {
    const getAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [r.id],
    };

    const getSong = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [r.id],
    };

    const albums = await this._pool.query(getAlbum);
    const songs = await this._pool.query(getSong);

    if (!albums.rowCount) throw new NotFoundError('Album tidak ditemukan.');

    return {
      id: albums.rows[0].id,
      name: albums.rows[0].name,
      year: albums.rows[0].year,
      coverUrl: albums.rows[0].coverUrl,
      songs: songs.rows
    };
  }

  async editById(p, b) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET "name" = $1, "year" = $2, "updated_at" = $3 WHERE id = $4',
      values: [b.name, b.year, updatedAt, p.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount)  throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
  }

  async editCoverById(p, b) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1, "updated_at" = $2 WHERE id = $3',
      values: [b.url, updatedAt, p.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
  }

  async addLikeById(r, a) {
    const id = `like-${nanoid(16)}`;

    const checkLike = {
      text: `SELECT * FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2`,
      values: [a.id, r.id],
    };

    const resultCheck = await this._pool.query(checkLike);

    if (!resultCheck.rowCount) {
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, a.id, r.id],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rowCount) throw new InvariantError('Gagal menambahkan like.');
    } else {
      await this.deleteLikeById(r, a);
    }

    await this._cache.delete(`album-likes:${r.id}`);
  }

  async deleteLikeById(r, a) {
    const query = {
      text: `DELETE FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2`,
      values: [a.id, r.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal menghapus like.');
  }

  async getLikesById(r) {
    try {
      const result = await this._cache.get(`album-likes:${r.id}`);
      const likes = parseInt(result);

      return {
        cache: true,
        likes,
      };
    } catch {
      const query = {
        text: 'SELECT COUNT(id) FROM user_album_likes WHERE "albumId" = $1',
        values: [r.id],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) throw new NotFoundError('Like tidak ditemukan.');

      const likes = parseInt(result.rows[0].count);

      await this._cache.set(`album-likes:${r.id}`, likes);

      return {
        cache: false,
        likes,
      };
    }
  }

  async delete(r) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [r.id],
    };
 
    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan.');
  }
}

module.exports = AlbumsService;