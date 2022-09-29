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

  pgm.addConstraint('playlists', 'fk_playlists.owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner');
  pgm.dropTable('playlists');
};
