const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (r, h) => handler.createUser(r, h),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (r) => handler.readUserById(r),
  },
];

module.exports = routes;
