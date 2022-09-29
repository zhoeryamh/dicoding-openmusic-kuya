const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
 
class AuthsService {
  constructor() {
    this._pool = new Pool();
  }

  async add(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    const result = await this._pool.query(query);
  }

  async verify(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
 
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Token tidak valid.');
  }

  async delete(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
 
    const result = await this._pool.query(query);
  }
}

module.exports = AuthsService;