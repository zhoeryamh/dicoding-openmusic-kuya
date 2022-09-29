const AuthsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collabs',
  version: '1.0.0',
  register: async (server, { 
    collabs,
    playlists,
    validator
  }) => {
    const collab = new AuthsHandler(
      collabs,
      playlists,
      validator
    );
    server.route(routes(collab));
  },
};
