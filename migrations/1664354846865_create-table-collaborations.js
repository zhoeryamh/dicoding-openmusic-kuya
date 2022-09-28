exports.up = pgm => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(32)',
    },
    user_id: {
      type: 'VARCHAR(32)',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('collaborations');
};
