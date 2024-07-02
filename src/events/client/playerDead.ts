import { type Chatter, Event } from '../../classes';
import constants from '../../constants';
import { formatStatValue } from '../../functions';
import type { PlayerStats } from '../../interfaces';

export default new Event(
   {
      name: 'playerDead'
   },
   (client, chatter: Chatter) => {
      client.room.round.playersStats[chatter.peerId].timeAliveMilliseconds =
         Date.now() - client.room.round.startTimestamp;

      const playerStats = client.room.round.playersStats[chatter.peerId];
      const playerStatsString = Object.keys(playerStats)
         .filter((statKey) => !!playerStats[statKey])
         .map(
            (statKey) =>
               `${constants.PLAYER_STAT_NAMES[statKey]} (${formatStatValue(statKey as keyof PlayerStats, playerStats[statKey])})`
         )
         .join(' — ');

      client.room.sendMessage(
         `Bien joué ${chatter.nickname} ! Voici vos scores pour cette partie: ${playerStatsString}`
      );
   }
);
