import { Client, Event } from '../../classes';
import { allClients, logger } from '../../globals';
import { createRoom } from '../../services/api';
import { createActiveRoom, getDefaultActiveRoom } from '../../services/db';

export default new Event('willTransferRoom', async (client) => {
   const { roomCode } = client.room.data.roomEntry;

   logger.warn(`Room transfer, destroying room: ${roomCode}`);

   client.room.destroy();

   const defaultRoom = await getDefaultActiveRoom();

   if (roomCode !== defaultRoom.code) return;

   setTimeout(
      async () => {
         logger.info('Recreating default room 10mins after transfer...');

         const newClient = new Client();

         allClients.push(newClient);

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

         await newClient.joinRoom(roomCode);

         newClient.room.resetRules();

         logger.info(`Default room recreated after transfer: ${roomCode}`);
      },
      10 * 60 * 1000
   );
});
