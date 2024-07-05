import { Event } from '../../classes';

export default new Event(
   {
      name: 'livesLost'
   },
   async (client, playerPeerId: number, remainingLives: number) => {
      if (playerPeerId !== client.room.selfPeerId) {
         if (!remainingLives) {
            const chatter = await client.room.getChatter(playerPeerId);
            client.emit('playerDead', chatter);
         } else {
            client.emit('trainHints');
         }
      }
   }
);
