const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (r, h) => handler.createCollab(r, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (r) => handler.deleteCollab(r),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];
 
module.exports = routes;