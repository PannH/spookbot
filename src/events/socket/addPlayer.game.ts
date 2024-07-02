import { Event } from '../../classes';
import type { Player } from '../../interfaces';

export default new Event(
   {
      name: 'addPlayer'
   },
   async (client, player: Player) => {
      const chatter = await client.room.getChatter(player.profile.peerId);
      client.room.seatingPlayers.push(chatter);
   }
);
