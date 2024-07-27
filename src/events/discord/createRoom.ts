import { Client, Event } from '../../classes';
import { allClients } from '../../globals';
import { createRoom } from '../../services/api';
import { createActiveRoom } from '../../services/db';

export default new Event(
   'createRoom',
   async (
      client,
      authId: string,
      nickname: string,
      callback: (roomCode: string) => void
   ) => {
      const newClient = new Client();

      allClients.push(newClient);

      const newRoomCode = await createRoom({
         creatorUserToken: process.env.CLIENT_USER_TOKEN,
         gameId: 'bombparty',
         isPublic: true,
         name: `${nickname} × 🎃`
      });

      await createActiveRoom({
         code: newRoomCode,
         isDefault: false,
         ownerAuthId: authId
      });

      callback(newRoomCode);

      await newClient.joinRoom(newRoomCode);

      newClient.room.resetRules();
   }
);
