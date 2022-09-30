exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlists', 'fk_playlists.owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner');
  pgm.dropTable('playlists');
};
