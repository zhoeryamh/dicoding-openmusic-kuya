const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (r, h) => handler.createSong(r, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (r) => handler.readSong(r),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (r) => handler.readSongById(r),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (r) => handler.updateSongById(r),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (r) => handler.deleteSongById(r),
  },
];

module.exports = routes;
