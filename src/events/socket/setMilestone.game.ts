import { Event, Round } from '../../classes';
import type { Milestone } from '../../types';

export default new Event(
   {
      name: 'setMilestone'
   },
   async (client, milestone: Milestone) => {
      switch (milestone.name) {
         case 'round': {
            client.emit('roundStart', milestone);

            if (milestone.currentPlayerPeerId === client.room.selfPeerId)
               client.emit('selfTurn', milestone.syllable);
            break;
         }

         case 'seating':
            client.emit('roundEnd', milestone);
            break;
      }
   }
);
