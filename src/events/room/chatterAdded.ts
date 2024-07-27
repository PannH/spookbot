import { Event } from '../../classes';
import type { ChatterProfile } from '../../interfaces';
import { getActiveRoomByCode, getProfileByAuthId } from '../../services/db';

export default new Event(
   'chatterAdded',
   async (client, chatterProfile: ChatterProfile) => {
      client.room.sendMessage(
         `Bienvenue ${chatterProfile.nickname} ! Vous pouvez utiliser /help pour voir les commandes et rejoindre le Discord: https://dsc.gg/spookbot`
      );

      const profile = await getProfileByAuthId(chatterProfile.auth?.id);
      const activeRoom = await getActiveRoomByCode(
         client.room.data.roomEntry.roomCode
      );

      if (
         profile?.roles?.length ||
         (chatterProfile.auth &&
            chatterProfile.auth.id === activeRoom.ownerAuthId)
      ) {
         const chatter = await client.room.getChatter(chatterProfile.peerId);
         chatter.setModerator(true).catch(() => {});
      }
   }
);
