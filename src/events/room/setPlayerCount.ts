import { Event } from '../../classes';
import { logger } from '../../globals';
import { getDefaultActiveRoom } from '../../services/db';

export default new Event(
   'setPlayerCount',
   async (client, playerCount: number) => {
      if (playerCount <= 1) {
         const defaultRoom = await getDefaultActiveRoom();

         if (defaultRoom.code === client.room.data.roomEntry.roomCode) return;

         client.room.destroyTimeout = setTimeout(
            () => {
               logger.info(
                  `Destroying room ${client.room.data.roomEntry.roomCode} after 10 minutes of inactivity`
               );
               client.room.destroy();
               client.room = null;
            },
            10 * 60 * 1000
         );
      } else if (playerCount > 1 && client.room.destroyTimeout) {
         clearTimeout(client.room.destroyTimeout);
         client.room.destroyTimeout = null;
      }
   }
);
