import { Event, Round } from '../../classes';
import type { Milestone } from '../../types';

export default new Event(
   {
      name: 'setMilestone'
   },
   async (client, milestone: Milestone) => {
      switch (milestone.name) {
         case 'round': {
            client.room.round = new Round(milestone, client);
            client.emit('roundStart');

            if (milestone.currentPlayerPeerId === client.room.selfPeerId)
               client.emit('selfTurn', milestone.syllable);
            break;
         }

         case 'seating':
            client.room.round = null;
            client.emit('roundEnd', milestone);
            break;
      }
   }
);
