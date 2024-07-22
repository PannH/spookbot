import { Client, Command } from '../classes';
import { createRoom } from '../services/api';
import { createActiveRoom, getActiveRoomByOwnerAuthId } from '../services/db';

export default new Command(
   {
      name: 'createroom',
      aliases: ['b'],
      description: 'Créer une nouvelle salle personnelle.',
      usageFormats: ['/b'],
      requireAuth: true
   },
   async (client, message) => {
      const currentPlayerRoom = await getActiveRoomByOwnerAuthId(
         message.chatter.profile.auth.id
      );

      if (currentPlayerRoom)
         return client.room.sendMessage(
            `Vous avez déjà une salle: https://jklm.fun/${currentPlayerRoom.code}`,
            'danger'
         );

      const newClient = new Client();

      const newRoomCode = await createRoom({
         creatorUserToken: process.env.CLIENT_USER_TOKEN,
         gameId: 'bombparty',
         isPublic: true,
         name: `${message.chatter.profile.nickname} × 🎃`
      });

      await createActiveRoom({
         code: newRoomCode,
         isDefault: false,
         ownerAuthId: message.chatter.profile.auth.id
      });

      client.room.sendMessage(
         `${message.chatter.profile.nickname}, voici votre salle: https://jklm.fun/${newRoomCode}`
      );

      await newClient.joinRoom(newRoomCode);

      newClient.room.resetRules();
   }
);
