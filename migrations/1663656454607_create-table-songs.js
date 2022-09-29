exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
    },
    albumId:{
      type: 'VARCHAR(32)',
      notNull: false,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('songs', 'fk_songs.albumId', 'FOREIGN KEY("albumId") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('songs', 'fk_songs.albumId');
  pgm.dropTable('songs');
};
