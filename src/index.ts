import 'dotenv/config';
import './socket';
import { allClients, dictionary, logger, prisma } from './globals';
import { Client } from './classes';
import {
   createActiveRoom,
   deleteRoomsByCode,
   getActiveRooms
} from './services/db';
import { createRoom, getRooms } from './services/api';
import { readdirSync, rmSync } from 'node:fs';
import { runBackup } from '@vorlefan/prisma-backup';
import { CronJob } from 'cron';

process.on('uncaughtException', (error, origin) => {
   logger.error(`Uncaught exception: ${error}`);
});

(async () => {
   await dictionary.initCache();

   let activeRooms = await getActiveRooms();
   const jklmRooms = await getRooms();

   const expiredRooms = activeRooms.filter(
      (activeRoom) =>
         !jklmRooms.some((room) => room.roomCode === activeRoom.code)
   );
   await deleteRoomsByCode(expiredRooms.map(({ code }) => code));

   activeRooms = activeRooms.filter((activeRoom) =>
      jklmRooms.some((room) => room.roomCode === activeRoom.code)
   );

   for (const activeRoom of activeRooms) {
      if (!jklmRooms.some((room) => room.roomCode === activeRoom.code))
         continue;

      const client = new Client();

      allClients.push(client);

      await client.joinRoom(activeRoom.code);

      logger.info(`Joined default room: ${activeRoom.code}`);
   }

   if (!activeRooms.some((activeRoom) => activeRoom.isDefault)) {
      const client = new Client();

      allClients.push(client);

      const roomCode = await createRoom({
         creatorUserToken: process.env.CLIENT_USER_TOKEN,
         gameId: 'bombparty',
         isPublic: process.env.ENV === 'prod',
         name: process.env.DEFAULT_ROOM_NAME
      });

      await createActiveRoom({
         code: roomCode,
         isDefault: true,
         ownerAuthId: null
      });

      await client.joinRoom(roomCode);

      logger.info(`Created and joined default room: ${roomCode}`);

      client.room.resetRules();
   }
})();

new CronJob(
   '0 0 0 * * *',
   async () => {
      logger.info('Running database backup...');
      const [profiles, records, words] = await prisma.$transaction([
         prisma.profile.findMany(),
         prisma.record.findMany(),
         prisma.word.findMany()
      ]);

      for (const backupFile of readdirSync('/').filter((fileName) =>
         /\d{13}(.zip)$/.test(fileName)
      )) {
         rmSync(backupFile, {
            recursive: true,
            force: true
         });
      }

      await runBackup({
         models: {
            profiles,
            records,
            words
         },
         compress: true,
         folder: 'backups/'
      });

      rmSync('backups/', {
         recursive: true,
         force: true
      });

      logger.info('Database backup complete');
   },
   null,
   true,
   'Europe/Brussels'
);
