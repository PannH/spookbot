import { Client } from '../classes';
import { allClients, logger } from '../globals';
import { getActiveRoomByCode } from '../services/db';

export async function handleClientReconnect(
   deadClient: Client,
   disconnectReason: string,
   socketType: 'game' | 'room'
): Promise<void> {
   const { roomCode } = deadClient.room.data.roomEntry;
   const activeRoom = await getActiveRoomByCode(roomCode);

   if (!activeRoom) return;

   logger.warn(
      `Unexpected disconnect from ${socketType} socket (room: ${roomCode}): ${disconnectReason}`
   );

   logger.info('Trying to reinstantiate client...');

   const newClient = new Client(
      deadClient.nickname,
      deadClient.picture,
      deadClient.chatDefaultColor,
      deadClient.room
   );

   allClients.push(newClient);

   await newClient.joinRoom(roomCode, true);
}
