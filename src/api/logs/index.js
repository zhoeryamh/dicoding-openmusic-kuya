const LogsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'logs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const log = new LogsHandler(service, validator);
    server.route(routes(log));
  },
};
