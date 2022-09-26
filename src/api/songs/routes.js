const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.createSong,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.readSong,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.readSongById,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.updateSongById,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongById,
  },
];

module.exports = routes;
