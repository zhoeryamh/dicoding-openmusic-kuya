const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (r, h) => handler.createAuth(r, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (r) => handler.updateAuth(r),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (r) => handler.deleteAuth(r),
  },
];

module.exports = routes;
