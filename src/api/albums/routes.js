const path = require('path');

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
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.uploadAlbumCover,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/covers/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'covers'),
      },
    },
  },
];

module.exports = routes;
