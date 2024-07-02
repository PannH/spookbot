import { Event } from '../../classes';

export default new Event(
   {
      name: 'removePlayer'
   },
   async (client, peerId: number) => {
      client.room.seatingPlayers = client.room.seatingPlayers.filter(
         (player) => player.peerId !== peerId
      );
   }
);
