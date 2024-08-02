import { Event } from '../../classes';
import type { ChatterProfile } from '../../interfaces';
import {
   getActiveRoomByCode,
   getBlacklistUser,
   getProfileByAuthId,
   getProfileShopItems
} from '../../services/db';

export default new Event(
   'chatterAdded',
   async (client, chatterProfile: ChatterProfile) => {
      const shopItems = await getProfileShopItems(chatterProfile.auth?.id);
      const greetingMessage = shopItems.find(
         (item) => item.itemId === 4
      )?.value;

      client.room.sendMessage(
         greetingMessage ??
            `Bienvenue ${chatterProfile.nickname} ! Vous pouvez utiliser /help pour voir les commandes et rejoindre le Discord: https://dsc.gg/spookbot`
      );

      const profile = await getProfileByAuthId(chatterProfile.auth?.id);
      const activeRoom = await getActiveRoomByCode(
         client.room.data.roomEntry.roomCode
      );
      const chatter = await client.room.getChatter(chatterProfile.peerId);
      const blacklistUser = await getBlacklistUser(chatterProfile?.auth?.id);

      if (blacklistUser) return chatter.ban();

      if (
         profile?.roles?.length ||
         (chatterProfile.auth &&
            chatterProfile.auth.id === activeRoom.ownerAuthId)
      ) {
         chatter.setModerator(true).catch(() => {});
      }
   }
);
