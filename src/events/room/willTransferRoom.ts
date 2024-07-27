import { Client, Event } from '../../classes';
import { allClients, logger } from '../../globals';
import { createRoom } from '../../services/api';
import { createActiveRoom } from '../../services/db';

export default new Event('willTransferRoom', async (client) => {
   client.room.destroy();

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

   logger.info(
      `Created and joined default room after room transfer: ${roomCode}`
   );

   newClient.room.resetRules();
});
