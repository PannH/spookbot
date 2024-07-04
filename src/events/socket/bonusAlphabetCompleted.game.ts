import { Event } from '../../classes';

export default new Event(
   {
      name: 'bonusAlphabetCompleted'
   },
   async (client, playerPeerId: number) => {
      if (playerPeerId === client.room.selfPeerId) return;

      client.room.round.playersStats[playerPeerId].lives++;

      const chatter = await client.room.getChatter(playerPeerId);

      client.room.sendMessage(
         `${chatter.nickname} a gagné une vie (${client.room.round.playersStats[playerPeerId].lives}).`
      );
   }
);
