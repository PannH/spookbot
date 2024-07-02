import { Event } from '../../classes';
import type { Player } from '../../interfaces';

export default new Event(
   {
      name: 'addPlayer'
   },
   async (client, player: Player) => {
      client.room.seatingPlayersCount++;
   }
);
