const AuthsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auths',
  version: '1.0.0',
  register: async (server, { 
    auths,
    users,
    token,
    validator,
  }) => {
    const auth = new AuthsHandler(
      auths,
      users,
      token,
      validator,
    );
    server.route(routes(auth));
  },
};
