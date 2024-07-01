import { Event } from '../../classes';
import type { ChatterProfileData } from '../../interfaces';

export default new Event(
   {
      name: 'addPlayer'
   },
   async (
      client,
      player: { isOnline: boolean; profile: ChatterProfileData }
   ) => {
      client.room.seatingPlayersCount++;
   }
);
