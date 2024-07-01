import { Event } from '../../classes';

export default new Event(
   {
      name: 'removePlayer'
   },
   async (client, peerId: number) => {
      client.room.seatingPlayersCount--;
   }
);
