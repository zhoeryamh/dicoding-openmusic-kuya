const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { 
    exports,
    playlists,
    validator
  }) => {
    const exportsHandler = new ExportsHandler( 
      exports,
      playlists,
      validator
    );
    server.route(routes(exportsHandler));
  },
};