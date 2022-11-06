const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (r, h) => handler.createPlaylist(r, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (r) => handler.readPlaylist(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (r) => handler.deletePlaylistById(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (r, h) => handler.insertSong(r, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (r) => handler.readSong(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (r) => handler.readLog(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (r) => handler.deleteSongById(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
