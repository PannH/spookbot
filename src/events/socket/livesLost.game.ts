import { Event } from '../../classes';

export default new Event(
   {
      name: 'livesLost'
   },
   async (client, playerPeerId: number, remainingLives: number) => {
      if (playerPeerId !== client.room.selfPeerId && !remainingLives) {
         const chatter = await client.room.getChatter(playerPeerId);
         client.emit('playerDead', chatter);
      }
   }
);
