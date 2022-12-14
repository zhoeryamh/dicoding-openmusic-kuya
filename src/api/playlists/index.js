const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, log, validator }) => {
    const playlists = new PlaylistsHandler(service, log, validator);
    server.route(routes(playlists));
  },
};
