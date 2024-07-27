import { Client, Command } from '../classes';
import { allClients, logger } from '../globals';
import { createRoom } from '../services/api';
import { createActiveRoom } from '../services/db';

export default new Command(
   {
      name: 'reboot',
      description: 'Redémarrer la salle par défaut.',
      usageFormats: ['/reboot'],
      trustedOnly: true
   },
   async (client, message) => {
      client.room.sendMessage('Redémarrage de la salle par défaut...');
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
         `Created and joined default room after manual reboot: ${roomCode}`
      );

      newClient.room.resetRules();

      client.room.sendMessage(`Salle redémarrée: https://jklm.fun/${roomCode}`);

      client.room.destroy();
   }
);
