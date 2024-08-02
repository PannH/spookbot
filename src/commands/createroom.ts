import { Client, Command } from '../classes';
import { allClients } from '../globals';
import { createRoom } from '../services/api';
import {
   createActiveRoom,
   getActiveRoomByOwnerAuthId,
   getProfileShopItems
} from '../services/db';

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

      const shopItems = await getProfileShopItems(
         message.chatter.profile.auth?.id
      );

      const nickname = shopItems.find((item) => item.itemId === 1)?.value;
      const picture = shopItems.find((item) => item.itemId === 2)?.value;
      const roomName = shopItems.find((item) => item.itemId === 5)?.value;
      const chatDefaultColor = shopItems.find(
         (item) => item.itemId === 3
      )?.value;

      const newClient = new Client(nickname, picture, chatDefaultColor);

      allClients.push(newClient);

      const newRoomCode = await createRoom({
         creatorUserToken: process.env.CLIENT_USER_TOKEN,
         gameId: 'bombparty',
         isPublic: true,
         name: roomName ?? `${message.chatter.profile.nickname} × 🎃`
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
