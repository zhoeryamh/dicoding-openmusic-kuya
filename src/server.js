require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const playlists = require('./api/playlists');
const users = require('./api/users');
const auths = require('./api/auths');
const collabs = require('./api/collabs');

// Services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const UsersService = require('./services/postgres/UsersService');
const AuthsService = require('./services/postgres/AuthsService');
const CollabsService = require('./services/postgres/CollabsService');

// Tokenman
const TokenManager = require('./tokenize/TokenManager');

// Validator
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const PlaylistsValidator = require('./validator/playlists');
const UsersValidator = require('./validator/users');
const AuthsValidator = require('./validator/auths');
const CollabsValidator = require('./validator/collabs');

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

  const collabsService = new CollabsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const playlistsService = new PlaylistsService(collabsService);
  const usersService = new UsersService();
  const authsService = new AuthsService();

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

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
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
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
    {
      plugin: collabs,
      options: {
        collabs: collabsService,
        playlists: playlistsService,
        validator: CollabsValidator,
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
