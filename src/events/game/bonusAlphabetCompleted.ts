import { Event } from '../../classes';

export default new Event(
   'bonusAlphabetCompleted',
   async (client, playerPeerId: number) => {
      if (playerPeerId === client.room.data.selfPeerId) return;

      const player = client.room.round.players.get(playerPeerId);

      player.incrementStat('lives');

      client.room.sendMessage(
         `${player.profile.nickname} a gagné une vie (${player.stats.lives}).`
      );
   }
);
