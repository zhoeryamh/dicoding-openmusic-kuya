const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.createCollab,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollab,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];
 
module.exports = routes;