const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (r, h) => handler.createAlbum(r, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: () => handler.readAlbum(),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (r) => handler.readAlbumById(r),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (r) => handler.updateAlbum(r),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (r) => handler.deleteAlbum(r),
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (r, h) => handler.uploadAlbumCover(r, h),
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
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (r, h) => handler.addAlbumLike(r, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (r, h) => handler.getAlbumLikesById(r, h),
  },
];

module.exports = routes;
