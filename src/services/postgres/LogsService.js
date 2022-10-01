const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
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

  async delete(r, a) {
    // await this.verifyActivitie(r, a);
    // const query = {
    //   text: 'DELETE FROM Activities WHERE id = $1',
    //   values: [r.id],
    // };
 
    // const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('Activitie gagal dihapus. Id tidak ditemukan.');
  }

  async verifyActivitie(r, a) {
    // const query = {
    //   text: 'SELECT owner FROM Activities WHERE id = $1',
    //   values: [r.id],
    // };
 
    // const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('Activitie tidak ada.');
    
    // const Activitie = result.rows[0];
    // if (Activitie.owner !== a.id) throw new AuthorizationError('Hak Akses Activitie tidak ada.');
  }

  async addSong(p, b, a) {
    // await this.verifySong(b);
    // await this.verifyAccess(p, a);

    // const id = `insert-${nanoid(16)}`;
    
    // const query = {
    //   text: 'INSERT INTO Activitie_songs VALUES($1, $2, $3)',
    //   values: [id, p.id, b.songId],
    // };

    // const result = await this._pool.query(query);

    // if (!result.rowCount) throw new InvariantError('Lagu gagal ditambahkan.'); 
  }

  async getSong(r) {
    // const query = {
    //   text: 'SELECT Activities.id, name, username FROM Activities JOIN users ON owner = users.id WHERE Activities.id = $1',
    //   values: [r.id],
    // };

    // const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('Activitie tidak ada.');
    
    // const data = {
    //   text: 'SELECT songs.id, title, performer FROM Activitie_songs JOIN songs ON "songId" = songs.id WHERE "ActivitieId" = $1',
    //   values: [r.id],
    // };

    // const songs = await this._pool.query(data);

    // return {
    //   id: result.rows[0].id,
    //   name: result.rows[0].name,
    //   username: result.rows[0].username,
    //   songs: songs.rows,
    // };
  }

  async deleteSong(p, b, a) {
    // await this.verifySong(b);
    // await this.verifyAccess(p, a);
    // const query = {
    //   text: 'DELETE FROM Activitie_songs WHERE "songId" = $1',
    //   values: [b.songId],
    // };
 
    // const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan.');
  }

  async verifySong(r) {
    // const query = {
    //   text: 'SELECT * FROM songs WHERE id = $1',
    //   values: [r.songId],
    // };
 
    // const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('Lagu tidak ada.');
  }

  async verifyAccess(r, a) {
    // try {
    //   await this.verifyActivitie(r, a);
    // } catch (error) {
    //   if (error instanceof NotFoundError) {
    //     throw error;
    //   }
    //   try {
    //     await this._collab.verify({ActivitieId: r.id, userId: a.id});
    //   } catch {
    //     throw error;
    //   }
    // }
  }
}

module.exports = LogsService;