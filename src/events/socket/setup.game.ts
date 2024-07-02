import { Event } from '../../classes';
import type { SetupData } from '../../interfaces';

export default new Event(
   {
      name: 'setup'
   },
   async (client, data: SetupData) => {
      switch (data.milestone.name) {
         case 'round': {
            client.emit('roundStart', data.milestone);

            if (data.milestone.currentPlayerPeerId === client.room.selfPeerId)
               client.emit('selfTurn', data.milestone.syllable);
            break;
         }

         case 'seating': {
            client.room.seatingPlayers = await Promise.all(
               data.players.map(
                  async (player) =>
                     await client.room.getChatter(player.profile.peerId)
               )
            );
            client.emit('roundEnd', data.milestone);
            break;
         }
      }
   }
);
