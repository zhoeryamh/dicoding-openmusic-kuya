exports.up = pgm => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(32)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    albumId: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user', 'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropTable('user_album_likes');
};
