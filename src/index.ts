import { configuration } from './config';
import Server from  './Server';

const server: Server = new Server(configuration);

server.bootstrap().run();
