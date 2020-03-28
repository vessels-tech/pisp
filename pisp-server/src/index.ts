'use strict';

import Hapi from '@hapi/hapi'
import Path from 'path'
// import { Inert } from 'inert'
const Inert = require('inert');

const init = async () => {

  const server = new Hapi.Server({
    port: 3000,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../../pisp-app/')
      }
    }
  });

  // Serve static files on /app
  await server.register(Inert);
  server.route({
    method: 'GET',
    path: '/app/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();