import { Event, Round } from '../../classes';
import constants from '../../constants';
import type { RoundMilestone } from '../../interfaces';

export default new Event(
   {
      name: 'roundStart'
   },
   (client, milestone: RoundMilestone) => {
      client.room.round = new Round(milestone, client);

      for (const player of client.room.seatingPlayers) {
         client.room.round.playersStats[player.peerId] =
            constants.DEFAULT_PLAYER_STATS;
      }
   }
);
