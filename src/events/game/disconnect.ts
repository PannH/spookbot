import { Client, Event } from '../../classes';
import { allClients, logger } from '../../globals';
import { getActiveRoomByCode } from '../../services/db';

export default new Event('disconnect', async (client, reason: string) => {
   if (!client.room) return;

   const activeRoom = getActiveRoomByCode(client.room.data.roomEntry.roomCode);

   if (!activeRoom) return;

   logger.warn(
      `Disconnected from game socket (room: ${client.room.data.roomEntry.roomCode}): ${reason}`
   );

   logger.info('Reinstantiating client...');

   const newClient = new Client(client.nickname, client.picture, client.room);

   allClients.push(newClient);

   await newClient.joinRoom(client.room.data.roomEntry.roomCode, true);
});
