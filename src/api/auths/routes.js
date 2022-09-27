const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.createAuth,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.updateAuth,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuth,
  },
];

module.exports = routes;
