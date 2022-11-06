require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const playlists = require('./api/playlists');
const users = require('./api/users');
const auths = require('./api/auths');
const collabs = require('./api/collabs');
const logs = require('./api/logs');
const _exports = require('./api/exports');
const { config } = require('./utils/index.js');

// Services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const UsersService = require('./services/postgres/UsersService');
const AuthsService = require('./services/postgres/AuthsService');
const CollabsService = require('./services/postgres/CollabsService');
const LogsService = require('./services/postgres/LogsService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService.js');

// Tokenman
const TokenManager = require('./tokenize/TokenManager');

// Validator
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const PlaylistsValidator = require('./validator/playlists');
const UsersValidator = require('./validator/users');
const AuthsValidator = require('./validator/auths');
const CollabsValidator = require('./validator/collabs');
const LogsValidator = require('./validator/logs');
const ExportsValidator = require('./validator/exports');

// Exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const cacheService = new CacheService();
  const logsService = new LogsService();
  const collabsService = new CollabsService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const playlistsService = new PlaylistsService(collabsService, logsService);
  const usersService = new UsersService();
  const authsService = new AuthsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/covers'));

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.token.key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.age,
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
        album: albumsService,
        storage: storageService,
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
        log: logsService,
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
    {
      plugin: logs,
      options: {
        service: logsService,
        validator: LogsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exports: ProducerService,
        playlists: playlistsService,
        validator: ExportsValidator,
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
