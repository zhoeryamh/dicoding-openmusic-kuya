const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { album, storage, validator }) => {
    const albums = new AlbumsHandler(album, storage, validator);
    server.route(routes(albums));
  },
};
