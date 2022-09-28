exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
    },
    owner: {
      type: 'VARCHAR(32)',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlists');
};
