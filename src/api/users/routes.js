const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.createUser,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.readUserById,
  },
];

module.exports = routes;
