import { Client, Event } from '../../classes';
import { logger } from '../../globals';

export default new Event('disconnect', async (client, reason: string) => {
   if (!client.room) return;

   logger.warn(
      `Disconnected from game socket (room: ${client.room.data.roomEntry.roomCode}): ${reason}`
   );

   logger.info('Reinstantiating client...');

   const newClient = new Client(client.nickname, client.picture, client);

   await newClient.joinRoom(client.room.data.roomEntry.roomCode, true);
});
