import { configuration } from './config';
import Server from  './Server';
import * as process from 'process';

const server: Server = new Server(configuration);

server.bootstrap().run();

process.on('SIGTERM', () => {
  server.close().then(() => {
    process.exit(0);
  });
});
