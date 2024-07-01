import { Event } from '../../classes';
import type { ChatterProfileData } from '../../interfaces';

export default new Event(
   {
      name: 'removePlayer'
   },
   async (client, peerId: number) => {
      client.room.seatingPlayersCount--;
   }
);
