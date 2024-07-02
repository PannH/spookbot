import { type Chatter, Event } from '../../classes';
import constants from '../../constants';

export default new Event(
   {
      name: 'playerDead'
   },
   (client, chatter: Chatter) => {
      const playerStats = client.room.round.playersStats[chatter.peerId];
      const playerStatsString = Object.keys(playerStats)
         .filter((statKey) => !!playerStats[statKey])
         .map(
            (statKey) =>
               `${constants.PLAYER_STAT_NAMES[statKey]} (${playerStats[statKey]})`
         )
         .join(', ');

      client.room.sendMessage(
         `Récapapitulatif de la partie de ${chatter.nickname}: ${playerStatsString}`
      );
   }
);
