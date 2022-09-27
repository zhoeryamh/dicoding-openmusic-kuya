require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const auths = require('./api/auths');

// Services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthsService = require('./services/postgres/AuthsService');

// Tokenman
const TokenManager = require('./tokenize/TokenManager');

// Validator
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthsValidator = require('./validator/auths');

// Exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authsService = new AuthsService();

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: auths,
      options: {
        auths: authsService,
        users: usersService,
        token: TokenManager,
        validator: AuthsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (r, h) => {
    const { response } = r;

    if (response instanceof ClientError) {
      const newResponse = h.response({ status: 'fail', message: response.message, });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    
    return response.continue || response;
  });

  await server.start();
  console.log(`Running on: ${server.info.uri}`);
};

init();
