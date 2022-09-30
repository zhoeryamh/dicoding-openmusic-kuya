exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    songId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song', 'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song');
  pgm.dropTable('playlist_songs');
};
