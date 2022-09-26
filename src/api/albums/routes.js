const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.createAlbum,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.readAlbum,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.readAlbumById,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.updateAlbum,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbum,
  },
];

module.exports = routes;
