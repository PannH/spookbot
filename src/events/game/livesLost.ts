import { Event } from '../../classes';

export default new Event(
   'livesLost',
   async (client, playerPeerId: number, remainingLives: number) => {
      if (playerPeerId === client.room.data.selfPeerId) return;

      if (!remainingLives)
         return void client.emit(
            'playerDie',
            client.room.round.players.get(playerPeerId)
         );

      if (client.room.trainCategory)
         return void client.emit(
            'trainHints',
            client.room.round.previousSyllable
         );
   }
);
