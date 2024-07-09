import { Event } from '../../classes';
import type { ChatterProfileData } from '../../interfaces';

export default new Event(
   {
      name: 'chatterAdded'
   },
   async (client, chatterData: ChatterProfileData) => {
      const chatter = await client.room.getChatter(chatterData.peerId);
      const profile = await chatter.getProfile();

      client.room.sendMessage(
         `Bienvenue ${chatter.nickname} ! Vous pouvez utiliser /help pour découvrir les commandes disponibles et rejoindre le serveur Discord: https://dsc.gg/spookbot`
      );

      if (
         profile?.staffRole ||
         (chatter.authId && chatter.authId === client.room.ownerAuthId)
      )
         chatter.setModerator(true);
   }
);
