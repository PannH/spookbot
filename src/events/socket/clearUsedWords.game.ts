import { Event } from '../../classes';
import type { Player } from '../../interfaces';

export default new Event(
   {
      name: 'clearUsedWords'
   },
   async (client) => {
      if (client.room.round) client.room.round.setWords = [];
   }
);
