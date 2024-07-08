import globals from './globals';
import { Client, type Event } from './classes';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { readdirSync } from 'node:fs';

dotenv.config();

process.on('uncaughtException', (error, origin) => {
   globals.logger.error(`Uncaught exception: ${error} at ${origin}`);
});

const defaultClient = new Client();

(async () => {
   const defaultRoom = await globals.prisma.activeRoom.findFirst({
      where: {
         isDefault: true
      },
      select: {
         code: true
      }
   });

   const rooms = await defaultClient.fetchRooms();

   if (rooms.find((room) => room.roomCode === defaultRoom?.code)) {
      await defaultClient.joinRoom(defaultRoom.code);
      defaultClient.room.joinRound();
   } else {
      await globals.prisma.activeRoom.deleteMany({
         where: {
            isDefault: true
         }
      });

      const roomCode = await defaultClient.createRoom({
         isPublic: false,
         isDefault: true
      });

      await defaultClient.joinRoom(roomCode);

      defaultClient.room.joinRound();
      defaultClient.room.setDefaultRules();
   }

   await globals.dictionary.initCache();
})();

(async () => {
   const httpServer = createServer();
   const io = new Server(httpServer, {
      transports: ['websocket']
   });

   globals.discordSocket = io;

   io.on('connection', (socket) => {
      globals.logger.info(`New socket connection (${socket.id})`);

      const eventFiles = readdirSync(`${globals.baseDir}/events/discord`);

      for (const file of eventFiles) {
         const event: Event = require(`./events/discord/${file}`).default;
         const callbackBind = event.callback.bind(null, defaultClient);

         socket[event.options.isOnce ? 'once' : 'on'](
            event.options.name,
            callbackBind
         );
      }
   });

   httpServer.listen(process.env.SERVER_PORT, () =>
      globals.logger.info(
         `Socket server listening at http://localhost:${process.env.SERVER_PORT}`
      )
   );
})();
