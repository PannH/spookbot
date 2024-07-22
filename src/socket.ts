import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { baseDir, logger, meta } from './globals';
import { readdirSync } from 'node:fs';
import type { Event } from './classes';

const httpServer = createServer();
const io = new Server(httpServer, {
   transports: ['websocket']
});

io.on('connection', (socket) => {
   logger.info(`New socket connection (${socket.id})`);
   const eventFiles = readdirSync(`${baseDir}/events/discord`);

   for (const file of eventFiles) {
      const event: Event = require(`./events/discord/${file}`).default;
      const callbackBind = event.callback.bind(null, meta.client);

      socket.on(event.name, callbackBind);
   }
});

httpServer.listen(process.env.SERVER_PORT, () =>
   logger.info(
      `Socket server listening at http://localhost:${process.env.SERVER_PORT}`
   )
);

export default io;
