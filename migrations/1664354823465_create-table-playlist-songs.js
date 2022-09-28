exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(32)',
    },
    song_id: {
      type: 'VARCHAR(32)',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlist_songs');
};
