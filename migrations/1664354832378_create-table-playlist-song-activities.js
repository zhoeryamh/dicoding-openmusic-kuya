exports.up = pgm => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(32)',
    },
    songId: {
      type: 'VARCHAR(32)',
    },
    userId: {
      type: 'VARCHAR(32)',
    },
    action: {
      type: 'VARCHAR(32)',
    },
    time: {
      type: 'TEXT',
    },
  });
  
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.song', 'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.user', 'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.song');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.user');
  pgm.dropTable('playlist_song_activities');
};
