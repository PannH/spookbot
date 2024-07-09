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
   await globals.dictionary.initCache();

   const allRooms = await defaultClient.fetchRooms();

   await globals.prisma.activeRoom.deleteMany({
      where: {
         code: {
            notIn: allRooms.map((room) => room.roomCode)
         }
      }
   });

   const defaultRoom = await globals.prisma.activeRoom.findFirst({
      where: {
         isDefault: true
      },
      select: {
         code: true
      }
   });

   if (!defaultRoom) {
      const roomCode = await defaultClient.createRoom({
         isDefault: true
      });

      await defaultClient.joinRoom(roomCode);

      defaultClient.room.joinRound();
      defaultClient.room.setDefaultRules();

      globals.discordSocket.emit('setDefaultRoom', roomCode);
   } else {
      await defaultClient.joinRoom(defaultRoom.code);
      defaultClient.room.joinRound();
      defaultClient.room.setDefaultRules();

      globals.discordSocket.emit('setDefaultRoom', defaultRoom.code);
   }

   const activeRooms = await globals.prisma.activeRoom.findMany({
      where: {
         isDefault: false
      },
      select: {
         code: true
      }
   });

   await Promise.all(
      activeRooms.map(async (room) => {
         const client = new Client();

         await client.joinRoom(room.code);
         client.room.joinRound();
         client.room.setDefaultRules();
      })
   );
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
