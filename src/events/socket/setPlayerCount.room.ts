import { Event } from '../../classes';

export default new Event(
   {
      name: 'setPlayerCount'
   },
   async (client, playerCount) => {
      if (playerCount === 1) {
         client.room.destroyTimeout = setTimeout(
            client.room.destroy,
            10 * 60 * 1000
         );
      } else {
         if (client.room.destroyTimeout) {
            clearTimeout(client.room.destroyTimeout);
            client.room.destroyTimeout = null;
         }
      }
   }
);
