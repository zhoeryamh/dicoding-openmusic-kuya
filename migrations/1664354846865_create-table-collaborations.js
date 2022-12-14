exports.up = pgm => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
  });
  
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist');
  pgm.dropTable('collaborations');
};
