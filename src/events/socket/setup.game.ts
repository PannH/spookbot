import { Event } from '../../classes';
import type { SetupData } from '../../interfaces';

export default new Event(
   {
      name: 'setup'
   },
   async (client, data: SetupData) => {
      switch (data.milestone.name) {
         case 'round': {
            client.room.round.syllable = data.milestone.syllable;
            client.emit('roundStart');

            if (data.milestone.currentPlayerPeerId === client.room.selfPeerId)
               client.emit('selfTurn', data.milestone.syllable);
            break;
         }

         case 'seating': {
            client.room.seatingPlayersCount = data.players.length;
            client.emit('roundEnd', data.milestone);
            break;
         }
      }
   }
);
