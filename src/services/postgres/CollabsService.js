const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollabsService {
    constructor() {
      this._pool = new Pool();
    }
  
    async add(r) {
      const check = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [r.userId],
      };
      
      const found = await this._pool.query(check);
      if (!found.rowCount) throw new NotFoundError('User tidak ada.');
      
      const id = `collab-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
        values: [id, r.playlistId, r.userId],
      };
  
      const result = await this._pool.query(query);
      if (!result.rowCount) throw new InvariantError('Kolaborasi gagal ditambahkan.');

      return result.rows[0].id;
    }
  
    async verify(r) {
      const query = {
        text: 'SELECT * FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2',
        values: [r.playlistId, r.userId],
      };
      
      const result = await this._pool.query(query);
      if (!result.rowCount) throw new AuthorizationError('Hak Akses kolaborasi tidak ada.');
    }
  
    async delete(r) {
      const query = {
        text: 'DELETE FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2',
        values: [r.playlistId, r.userId],
      };
   
      const result = await this._pool.query(query);
      if (!result.rowCount) throw new InvariantError('Kolaborasi gagal dihapus.');
    }
  }
  
  module.exports = CollabsService;