const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (r, h) => handler.exportPlaylist(r, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];
 
module.exports = routes;