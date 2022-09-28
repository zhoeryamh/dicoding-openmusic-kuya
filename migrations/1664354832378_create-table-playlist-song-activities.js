exports.up = pgm => {
  pgm.createTable('playlist_song_activities', {
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
    user_id: {
      type: 'VARCHAR(32)',
    },
    action: {
      type: 'VARCHAR(32)',
    },
    time: {
      type: 'TEXT',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlist_song_activities');
};
