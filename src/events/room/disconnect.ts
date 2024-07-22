import { Event } from '../../classes';
import { logger } from '../../globals';

export default new Event('disconnect', async (client, reason: string) => {
   if (!client.room) return;

   logger.warn(
      `Disconnected from room socket (room: ${client.room.data.roomEntry.roomCode}): ${reason}`
   );
});
