const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
 
class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async add(r) {
    await this.verify(r.username);
    const id = `user-${nanoid(16)}`;
    const hash = await bcrypt.hash(r.password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, r.username, r.password, r.fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('User gagal ditambahkan'); 
    return result.rows[0].id;
  }

  async verify(user) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [user],
    };
 
    const result = await this._pool.query(query);
    if (result.rowCount) throw new InvariantError('Username sudah digunakan.');
  }

  async getById(r) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [r.id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('User tidak ditemukan'); 
    return result.rows[0];
  }
}

module.exports = UsersService;